
import { GoogleGenAI, Type, Part, Modality } from "@google/genai";
import { QuizQuestion, QuizAttempt, GeneratedAnswer, LessonPlan, Worksheet, CustomGame } from '../types';
import { OFFICIAL_BOOK_DATABASE } from '../constants';

// The API key MUST be provided in the environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- SYSTEM INSTRUCTION FRAGMENTS ---
const SIMPLE_ENGLISH_INSTRUCTION = "Use simple, easy-to-understand English suitable for a Pakistani student audience. Avoid fancy or complex vocabulary. Keep sentences clear and direct.";

const quizQuestionSchema = {
    type: Type.OBJECT,
    properties: {
        question: { type: Type.STRING, description: "The text of the quiz question." },
        type: { type: Type.STRING, description: "The type of question, either 'multiple-choice' or 'fill-in-the-blank' or 'short-answer'." },
        options: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "An array of 4 multiple-choice answers. Required for 'multiple-choice' type."
        },
        correctAnswer: { type: Type.STRING, description: "The correct answer. For multiple-choice, it's one of the options." },
    },
    required: ["question", "type", "correctAnswer"]
};

const quizSchema = {
    type: Type.ARRAY,
    description: "An array of 5 quiz questions.",
    items: quizQuestionSchema
};


const answerSchema = {
    type: Type.OBJECT,
    properties: {
        answer: { type: Type.STRING, description: "The direct answer to the question." },
        explanation: { type: Type.STRING, description: "A detailed, step-by-step explanation of the answer." },
    },
    required: ["answer", "explanation"]
};

const generateWithSchema = async (prompt: string, contentParts: Part[], schema: object) => {
    const finalContent = [...contentParts, { text: prompt }];
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: finalContent },
        config: {
            responseMimeType: "application/json",
            responseSchema: schema
        }
    });

    const jsonString = response.text.replace(/```json\n?|```/g, '').trim();
    return JSON.parse(jsonString);
};

/**
 * Generates a quiz from user-provided content (text or image).
 */
export const generateQuizFromContent = async (contentParts: Part[]): Promise<QuizQuestion[]> => {
    try {
        const prompt = "Based ONLY on the provided text and/or image content, generate a quiz of 5 questions. The questions must be answerable using only the information given. Ensure a mix of multiple-choice and fill-in-the-blank questions if appropriate. " + SIMPLE_ENGLISH_INSTRUCTION;
        
        const parsed = await generateWithSchema(prompt, contentParts, quizSchema);
        if (Array.isArray(parsed)) {
            return parsed.map((q: any) => ({
                ...q,
                options: q.type === 'multiple-choice' ? q.options || [] : undefined
            }));
        }
        throw new Error("Invalid format received from API");
    } catch (error) {
        console.error("Error generating quiz from content:", error);
        throw new Error("Failed to generate quiz from your content.");
    }
};


/**
 * Generates a summary from user-provided content.
 */
export const generateSummaryFromContent = async (contentParts: Part[]): Promise<string> => {
    try {
        const prompt = "Please provide a concise, easy-to-understand summary of the following content. " + SIMPLE_ENGLISH_INSTRUCTION;
        const finalContent = [...contentParts, { text: prompt }];
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: finalContent },
        });
        return response.text;
    } catch (error) {
        console.error("Error generating summary from content:", error);
        throw new Error("Failed to generate summary from your content.");
    }
};

/**
 * Generates a detailed answer for a general knowledge question.
 */
export const generateAnswer = async (question: string): Promise<GeneratedAnswer> => {
     try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: question,
            config: {
                systemInstruction: "You are an expert tutor. Answer the user's question clearly and provide a helpful explanation. " + SIMPLE_ENGLISH_INSTRUCTION,
                responseMimeType: "application/json",
                responseSchema: answerSchema,
            },
        });
        const jsonString = response.text.replace(/```json\n?|```/g, '').trim();
        return JSON.parse(jsonString);
    } catch (error) {
        console.error("Error generating answer:", error);
        throw new Error("Failed to generate an answer for your question.");
    }
};


/**
 * Generates a set of quiz questions using the Gemini API.
 */
export const generatePresetQuiz = async (subject: string, grade: string, count: number, topic?: string, difficulty?: 'easy' | 'medium' | 'hard'): Promise<QuizQuestion[]> => {
    const topicInstruction = topic ? `The user has specified a specific topic: "${topic}". All questions MUST be about this topic. This is the most important instruction.` : 'The user has not specified a topic, so questions should be about the general subject.';
    const difficultyInstruction = difficulty ? `The questions must be of ${difficulty} difficulty.` : 'The questions should be of medium difficulty.';

    const prompt = `
        Generate ${count} unique quiz questions for a ${grade} student.
        The general subject is "${subject}".
        ${difficultyInstruction}
        ${topicInstruction}
        
        Ensure questions use simple English.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: `You are an expert educator and quiz creator. Your primary goal is to generate high-quality, factually accurate quiz questions that strictly follow the user's specified grade level and difficulty.
                
                IMPORTANT: The complexity and vocabulary must be strictly suitable for a ${grade} student. ${SIMPLE_ENGLISH_INSTRUCTION}
                
                If a specific topic is provided, every single question must be directly and exclusively about that topic. Your precision is key.
                
                Additional Rules:
                1.  Factual Accuracy: All questions and answers must be factually correct.
                2.  Question Types: For subjects like 'Maths' or 'Physics', include a mix of 'multiple-choice' and 'fill-in-the-blank' question types. The problems must be solvable with clear, non-ambiguous answers.
                3.  Options: 'multiple-choice' questions must have exactly 4 options. 'fill-in-the-blank' questions should not have an options array.
                4.  Uniqueness: Do not repeat questions.`,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        questions: {
                            type: Type.ARRAY,
                            description: `An array of ${count} quiz questions.`,
                            items: quizQuestionSchema,
                        }
                    },
                    required: ["questions"]
                }
            }
        });
        
        const jsonString = response.text.replace(/```json\n?|```/g, '').trim();
        const parsed = JSON.parse(jsonString);

        if (parsed.questions && Array.isArray(parsed.questions)) {
            // Ensure data consistency
            return parsed.questions.map((q: any) => ({
                ...q,
                options: q.type === 'multiple-choice' ? q.options || [] : undefined
            }));
        } else {
            console.error("Invalid format received from API. Expected { questions: [] }", parsed);
            throw new Error("Invalid format received from API");
        }
    } catch (error) {
        console.error("Error generating preset quiz:", error);
        return [{
            question: "Oops! We had trouble generating the quiz. This could be due to a configuration issue or a problem reaching the AI service.",
            type: 'multiple-choice',
            options: ["Try again later", "Check API Key", "Adjust parameters", "Go back"],
            correctAnswer: "Try again later"
        }];
    }
};

/**
 * Generates an improvement tip for a quiz question.
 */
export const getImprovementTip = async (question: QuizQuestion, userAnswer: string, grade: string): Promise<string> => {
  const prompt = `
    I'm a ${grade} student and I just answered a quiz question incorrectly. Can you give me a helpful tip to remember the correct answer next time? Please keep the explanation appropriate for my grade level and use simple English.
    
    Question: "${question.question}"
    My Incorrect Answer: "${userAnswer}"
    The Correct Answer: "${question.correctAnswer}"

    Provide a concise and easy-to-understand tip.
  `;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error fetching tip from Gemini API:", error);
    return "Could not load a tip. Remember to review your study materials for this topic!";
  }
};

const FACT_CACHE_KEY = 'didYouKnowFact';
const FACT_CACHE_DURATION = 1 * 60 * 60 * 1000; // 1 hour in milliseconds

export const getDidYouKnowFact = async (): Promise<string> => {
  const cachedItem = localStorage.getItem(FACT_CACHE_KEY);
  if (cachedItem) {
    try {
      const { fact, timestamp } = JSON.parse(cachedItem);
      if (Date.now() - timestamp < FACT_CACHE_DURATION) {
        return fact;
      }
    } catch (e) {
      console.error("Could not parse cached fact, fetching new one.", e);
      localStorage.removeItem(FACT_CACHE_KEY); // Clear corrupted cache
    }
  }

  const prompt = "Tell me a fun and interesting 'did you know' fact appropriate for a student. The fact should be surprising and educational. Keep it to one or two short sentences. Use simple English.";

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    const newFact = response.text;
    localStorage.setItem(FACT_CACHE_KEY, JSON.stringify({ fact: newFact, timestamp: Date.now() }));
    return newFact;
  } catch (error) {
    console.error("Error fetching fact from Gemini API:", error);
    return "Did you know that the heart of a blue whale is as big as a small car?"; // Fallback fact
  }
};

export const getSchoolInfo = async (): Promise<string> => {
    const prompt = `Please provide a professional, engaging, and comprehensive description for a school named "The Educators". The description should cover its mission, vision, values, curriculum approach, and extra-curricular activities. Format it nicely with markdown for an "About Us" page on a website. Use headings for each section.`;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: "You are a professional copywriter specializing in educational institutions. Use clear, accessible English."
            }
        });
        return response.text;
    } catch (error) {
        console.error("Error fetching school info from Gemini API:", error);
        return "### Our Mission\n\nThe Educators is dedicated to fostering academic excellence and personal growth in a supportive and dynamic learning environment. We aim to equip students with the knowledge, skills, and values necessary to thrive in an ever-changing world.\n\n### Our Vision\n\nTo be a leading educational institution recognized for our commitment to quality education, innovative teaching methodologies, and the holistic development of our students.";
    }
}

const MOCK_LESSON_PLAN: LessonPlan = {
    title: "Introduction to Photosynthesis (Sample Plan)",
    objectives: [
        "Define photosynthesis.",
        "Identify the key inputs and outputs of photosynthesis.",
        "Explain why photosynthesis is important for life on Earth."
    ],
    materials: [
        "Whiteboard or chalkboard",
        "Markers or chalk",
        "Diagram of a plant cell",
        "Student notebooks"
    ],
    sections: [
        { title: "Introduction", duration: 10, content: "Start with a question: 'Where do plants get their food?' Briefly discuss student ideas and address misconceptions." },
        { title: "Direct Instruction", duration: 15, content: "Explain the process of photosynthesis using the plant cell diagram. Write the chemical equation on the board (6CO2 + 6H2O → C6H12O6 + 6O2) and explain each part." },
        { title: "Activity: Think-Pair-Share", duration: 15, content: "Students pair up to discuss why photosynthesis is crucial for animals, including humans. Share key ideas with the class." },
        { title: "Assessment / Wrap-up", duration: 5, content: "Ask students to write down a one-sentence summary of photosynthesis in their notebooks as an exit ticket." }
    ]
};

/**
 * Generates a structured, lecture-focused lesson plan for teachers in potentially two languages.
 */
export const generateLessonPlan = async (topic: string, grade: string, duration: number, objectives: string, language1: string, language2: string): Promise<LessonPlan> => {
    const languageInstruction = language1 === language2 
        ? `The entire lesson plan should be in ${language1}.`
        : `The lesson plan should be primarily written in ${language1}. For key concepts, vocabulary, and section summaries, please also provide a translation or equivalent in ${language2}.`;

    const prompt = `
        Create a detailed, lecture-focused lesson plan for a ${grade} class. This should be structured as a teacher's script or detailed talking points for a lecture, not a list of student activities.
        
        Topic: ${topic}
        Lesson Duration: ${duration} minutes
        Key Learning Objectives: ${objectives}
        Languages: ${languageInstruction}

        Please structure the lesson plan with clear sections (e.g., Introduction, Core Concept 1, Core Concept 2, Conclusion). For each section, provide detailed talking points a teacher could use to explain the material.
    `;
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: `You are an expert curriculum designer for K-12 and university education. Your goal is to create practical, engaging, and well-structured lesson plans that are focused on direct instruction and lecturing. Avoid suggesting group activities, games, or flashcards. Focus on the content the teacher will deliver. ${languageInstruction} Keep the English portions simple and direct.`,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING },
                        objectives: { type: Type.ARRAY, items: { type: Type.STRING } },
                        materials: { type: Type.ARRAY, items: { type: Type.STRING } },
                        sections: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    title: { type: Type.STRING, description: "e.g., 'Introduction', 'Core Concept: Photosynthesis', 'Conclusion'" },
                                    duration: { type: Type.NUMBER, description: "Duration in minutes" },
                                    content: { type: Type.STRING, description: "Detailed talking points, explanations, and key vocabulary for this section of the lecture. Include bilingual content as requested." }
                                },
                                required: ["title", "duration", "content"]
                            }
                        }
                    },
                    required: ["title", "objectives", "materials", "sections"]
                }
            }
        });
        const jsonString = response.text.replace(/```json\n?|```/g, '').trim();
        return JSON.parse(jsonString);
    } catch (error) {
        console.error("Error generating lesson plan:", error);
        const mockPlan = { ...MOCK_LESSON_PLAN };
        mockPlan.title = `${topic} (Sample Plan)`;
        return mockPlan;
    }
};


/**
 * Generates a student report card comment for teachers.
 */
export const generateStudentReport = async (studentName: string, strengths: string, weaknesses: string, comments: string): Promise<string> => {
    const prompt = `
        Please write a professional and constructive report card comment for a student named ${studentName}.
        
        Key Strengths:
        ${strengths}

        Areas for Improvement:
        ${weaknesses}

        Additional Comments:
        ${comments}

        Combine these points into a single, well-written paragraph. The tone should be encouraging and supportive, even when discussing areas for improvement. Use simple, clear English.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: "You are an experienced educator skilled at writing thoughtful and professional student reports. Your tone is always constructive and encouraging. Avoid complex words."
            }
        });
        return response.text;
    } catch (error) {
        console.error("Error generating student report:", error);
        throw new Error("Failed to generate the student report. Please try again.");
    }
};

// --- WORKSHEET GENERATOR ---

const worksheetQuestionSchema = {
    type: Type.OBJECT,
    properties: {
        question: { type: Type.STRING },
        type: { type: Type.STRING, description: "e.g., 'multiple-choice', 'fill-in-the-blank', 'short-answer'" },
        options: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "For 'multiple-choice' questions."
        },
        answer: {
            type: Type.STRING,
            description: "The correct answer. For MCQs, it should be one of the options. For others, it's the direct answer."
        }
    },
    required: ["question", "type"]
};

export const generateWorksheet = async (topic: string, grade: string, subject: string, questionCounts: { 'multiple-choice': number; 'fill-in-the-blank': number; 'short-answer': number; }): Promise<Worksheet> => {
    const totalQuestions = questionCounts['multiple-choice'] + questionCounts['fill-in-the-blank'] + questionCounts['short-answer'];
    
    const prompt = `
        Generate a worksheet for a ${grade} student on the subject of "${subject}".
        The specific topic is "${topic}".
        The worksheet should have exactly:
        - ${questionCounts['multiple-choice']} multiple-choice questions.
        - ${questionCounts['fill-in-the-blank']} fill-in-the-blank questions.
        - ${questionCounts['short-answer']} short-answer questions.
        The total number of questions must be ${totalQuestions}.
        Use simple English.
    `;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: "You are an expert curriculum designer. Create age-appropriate and educationally sound worksheets with the exact number of each question type specified. Keep the language simple and clear.",
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING, description: `A suitable title for the worksheet about ${topic}.` },
                        instructions: { type: Type.STRING, description: "Brief instructions for the student." },
                        questions: {
                            type: Type.ARRAY,
                            description: `An array of exactly ${totalQuestions} questions, composed of ${questionCounts['multiple-choice']} multiple-choice, ${questionCounts['fill-in-the-blank']} fill-in-the-blank, and ${questionCounts['short-answer']} short-answer questions.`,
                            items: worksheetQuestionSchema
                        }
                    },
                    required: ["title", "instructions", "questions"]
                }
            }
        });
        const jsonString = response.text.trim();
        return JSON.parse(jsonString);
    } catch (error) {
        console.error("Error generating worksheet:", error);
        throw new Error("Failed to generate the worksheet.");
    }
};

// --- BOOK WISE ---

export const generateBookIndex = async (title: string, board: string, grade: string): Promise<string[]> => {
    // 1. Check Official Database First
    const officialBooks = OFFICIAL_BOOK_DATABASE[grade];
    if (officialBooks) {
        // Try to find a partial match in the database keys
        const subjectKey = Object.keys(officialBooks).find(s => title.toLowerCase().includes(s.toLowerCase()));
        if (subjectKey) {
            return officialBooks[subjectKey];
        }
    }

    // 2. Fallback to AI generation if not in static DB (for other books/grades)
    const prompt = `
    List the chapter titles for the textbook "${title}" used in the ${board} curriculum for Grade ${grade} in Pakistan (2025 Edition).
    If you don't have the exact list, assume a standard curriculum for this subject and grade level and generate a plausible list of 8-12 chapters.
    Return ONLY a JSON object with a "chapters" key containing an array of strings.
    Example: { "chapters": ["Chapter 1: Introduction", "Chapter 2: ..."] }
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        chapters: { type: Type.ARRAY, items: { type: Type.STRING } }
                    },
                    required: ["chapters"]
                }
            }
        });
        const jsonString = response.text.replace(/```json\n?|```/g, '').trim();
        return JSON.parse(jsonString).chapters;
    } catch (error) {
        console.error("Error generating book index:", error);
        return ["Chapter 1: Introduction", "Chapter 2: Core Concepts", "Chapter 3: Analysis", "Chapter 4: Conclusion"];
    }
};

export const generateChapterContent = async (bookTitle: string, chapterTitle: string, board: string, grade: string): Promise<string> => {
    const prompt = `
    Retrieve the full text content for "${chapterTitle}" from the official textbook "${bookTitle}" (${board} Board, Grade ${grade}, 2025-2026 Edition).
    
    CRITICAL INSTRUCTIONS:
    1. Act as a database retriever. Do NOT generate new creative content.
    2. Use Google Search to find the exact topics, headings, definitions, and explanations from the official Pakistani curriculum book.
    3. Structure this exactly like the textbook chapter: Title -> Introduction -> Main Headings -> Subheadings -> Summary.
    4. Be comprehensive. Cover all key definitions, formulas, and dates mentioned in the real book.
    5. Use Markdown formatting (bold, bullet points, headings) to make it readable.
    6. Ensure the content is accurate to the 2025 syllabus.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }], // Use search grounding to get accurate book content
            }
        });
        return response.text;
    } catch (error) {
        console.error("Error generating chapter content:", error);
        return "## Error\n\nCould not retrieve chapter content. Please check your connection and try again.";
    }
};

export const generateBookQuiz = async (bookTitle: string, chapters: string[], questionCounts: { 'multiple-choice': number; 'fill-in-the-blank': number; 'short-answer': number }, board?: string, grade?: string): Promise<QuizQuestion[]> => {
    const totalQuestions = questionCounts['multiple-choice'] + questionCounts['fill-in-the-blank'] + questionCounts['short-answer'];
    const prompt = `
        Use Google Search to find the specific content of "${bookTitle}" (Chapter(s): ${chapters.join(', ')}) for the ${board || 'General'} curriculum (Pakistan), Grade ${grade || 'Student'}.
        
        Then, generate a quiz with exactly:
        - ${questionCounts['multiple-choice']} multiple-choice questions.
        - ${questionCounts['fill-in-the-blank']} fill-in-the-blank questions.
        - ${questionCounts['short-answer']} short-answer questions.
        
        The questions must be based on the specific facts, dates, and definitions found in the textbook for this board.
        
        IMPORTANT: Return the result as a raw JSON object string inside a markdown code block. Do NOT include any other text.
        Structure:
        {
          "questions": [
            {
              "question": "...",
              "type": "multiple-choice" | "fill-in-the-blank" | "short-answer",
              "options": ["A", "B", "C", "D"], // Only for multiple-choice
              "correctAnswer": "..."
            }
          ]
        }
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }], // Enable Search Grounding
                systemInstruction: "You are an expert exam setter for Pakistani Education Boards. Ensure questions align strictly with the textbook content found via search. Use simple, direct English in the questions and answers."
            }
        });
        
        const jsonString = response.text.replace(/```json\n?|```/g, '').trim();
        const parsed = JSON.parse(jsonString);
        
        if (parsed.questions && Array.isArray(parsed.questions)) {
             return parsed.questions.map((q: any) => ({
                ...q,
                options: q.type === 'multiple-choice' ? q.options || [] : undefined
            }));
        }
        throw new Error("Invalid format received");
    } catch (error) {
        console.error("Error generating book quiz:", error);
        throw new Error("Failed to generate book quiz.");
    }
};

// --- CREATE GAME ---

const gameValidationSchema = {
    type: Type.OBJECT,
    properties: {
        feasible: { type: Type.BOOLEAN, description: "Whether the game idea is simple enough to be created. It must be a simple 'quiz' or 'greater_than' comparison game." },
        reason: { type: Type.STRING, description: "If not feasible, a brief reason why. Otherwise, a confirmation." },
        gameType: { type: Type.STRING, enum: ['quiz', 'greater_than'], description: "The identified game type." },
        topic: { type: Type.STRING, description: "The core subject or topic of the game (e.g., 'Planets', 'Addition')." }
    },
    required: ["feasible", "reason", "gameType", "topic"]
};

export const validateGameIdea = async (idea: string): Promise<{ feasible: boolean; reason: string; gameType: 'quiz' | 'greater_than'; topic: string; }> => {
    const prompt = `Analyze the following game idea. Determine if it can be implemented as a simple 'quiz' (multiple choice) or 'greater_than' (pick the bigger number) game.
    
    Idea: "${idea}"
    
    Respond with whether it is feasible, the game type, and the main topic. If not feasible, explain why (e.g., "requires real-time physics," "too complex").`;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: gameValidationSchema
            }
        });
        const jsonString = response.text.trim();
        return JSON.parse(jsonString);
    } catch (error) {
        console.error("Error validating game idea:", error);
        throw new Error("Failed to validate game idea.");
    }
};

const quizGameContentSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING },
        description: { type: Type.STRING },
        data: {
            type: Type.ARRAY,
            description: "Array of 10 quiz questions.",
            items: {
                type: Type.OBJECT,
                properties: {
                    question: { type: Type.STRING },
                    options: { type: Type.ARRAY, items: { type: Type.STRING } },
                    correctAnswer: { type: Type.STRING }
                },
                required: ["question", "options", "correctAnswer"]
            }
        }
    },
    required: ["title", "description", "data"]
};

const greaterThanGameContentSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING },
        description: { type: Type.STRING },
        data: {
            type: Type.ARRAY,
            description: "Array of 10 pairs of numbers.",
            items: {
                type: Type.OBJECT,
                properties: {
                    options: { type: Type.ARRAY, items: { type: Type.NUMBER }, description: "A pair of two numbers." },
                    answer: { type: Type.NUMBER, description: "The greater of the two numbers." }
                },
                required: ["options", "answer"]
            }
        }
    },
    required: ["title", "description", "data"]
};

export const generateGameContent = async (gameType: 'quiz' | 'greater_than', topic: string, idea: string): Promise<{ title: string; description: string; data: any[] }> => {
    const isQuiz = gameType === 'quiz';
    const prompt = `Generate the content for a game based on this idea: "${idea}".
    Game Type: ${gameType}
    Topic: ${topic}
    
    Provide a suitable title, a short description, and an array of 10 data objects for the game engine.
    ${isQuiz ? "For 'quiz', each object needs 'question', 'options' (array of 4 strings), and 'correctAnswer'." : "For 'greater_than', each object needs 'options' (array of 2 numbers) and 'answer' (the greater number)."}
    
    Use simple English.
    `;
    const schema = isQuiz ? quizGameContentSchema : greaterThanGameContentSchema;
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: schema
            }
        });
        const jsonString = response.text.trim();
        return JSON.parse(jsonString);
    } catch (error) {
        console.error("Error generating game content:", error);
        throw new Error("Failed to generate game content.");
    }
};

export const generateGameImagePrompt = async (topic: string, idea: string): Promise<string> => {
    const prompt = `Generate a short, creative image generation prompt for an icon for a game.
    Game Topic: ${topic}
    Game Idea: "${idea}"
    The style should be a simple, flat, vector icon on a clean background.
    Example: "A simple vector icon of a smiling planet with a ring."
    Return only the prompt string.`;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text.trim();
    } catch (error) {
        console.error("Error generating image prompt:", error);
        throw new Error("Failed to generate image prompt.");
    }
};

export const generateImage = async (prompt: string): Promise<string> => {
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/png',
                aspectRatio: '1:1',
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            return response.generatedImages[0].image.imageBytes;
        }
        throw new Error("No image was generated.");
    } catch (error) {
        console.error("Error generating image:", error);
        throw new Error("Failed to generate image.");
    }
};

// --- URDU ARCADE ---

export const generateLafzJodoChallenge = async (difficulty: 'easy' | 'medium' | 'hard'): Promise<{ letters: string[], solutions: string[] }> => {
    const prompt = `Generate a 'Word Connect' puzzle in Urdu.
    Difficulty: ${difficulty}
    
    Provide:
    1. A set of individual Urdu letters (6-8 letters).
    2. A list of valid Urdu words that can be formed using ONLY these letters.
    `;

    const schema = {
        type: Type.OBJECT,
        properties: {
            letters: { type: Type.ARRAY, items: { type: Type.STRING } },
            solutions: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["letters", "solutions"]
    };

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: schema
            }
        });
        const jsonString = response.text.replace(/```json\n?|```/g, '').trim();
        return JSON.parse(jsonString);
    } catch (error) {
        console.error("Error generating Lafz Jodo:", error);
        throw new Error("Failed to generate puzzle.");
    }
};

export const generateJumlaSaziWord = async (difficulty: 'easy' | 'medium' | 'hard', language: string): Promise<string> => {
    const prompt = `Generate a single, common word in ${language} (Urdu script) suitable for making a sentence.
    Difficulty: ${difficulty}.
    Output ONLY the word in JSON format { "word": "..." }.`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: { word: { type: Type.STRING } },
                    required: ["word"]
                }
            }
        });
        const jsonString = response.text.replace(/```json\n?|```/g, '').trim();
        return JSON.parse(jsonString).word;
    } catch (error) {
        console.error("Error generating Jumla Sazi word:", error);
        return "کتاب"; // Fallback
    }
};

export const validateJumlaSaziSentence = async (sentence: string, word: string, language: string): Promise<{ isValid: boolean; feedback: string }> => {
    const prompt = `Evaluate this ${language} sentence: "${sentence}".
    1. Does it correctly use the word "${word}"?
    2. Is it grammatically correct?
    
    Provide a boolean 'isValid' and a short 'feedback' string in English (or Roman Urdu) explaining why. Use simple English for feedback.`;

    const schema = {
        type: Type.OBJECT,
        properties: {
            isValid: { type: Type.BOOLEAN },
            feedback: { type: Type.STRING }
        },
        required: ["isValid", "feedback"]
    };

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: schema
            }
        });
        const jsonString = response.text.replace(/```json\n?|```/g, '').trim();
        return JSON.parse(jsonString);
    } catch (error) {
        console.error("Error validating sentence:", error);
        return { isValid: false, feedback: "Error validating sentence." };
    }
};

export const generateMuhavraChallenge = async (): Promise<{ muhavra: string, meaning: string, decoys: string[] }> => {
    const prompt = `Generate an Urdu Idiom (Muhavra).
    Provide:
    1. The Muhavra (in Urdu script).
    2. Its correct meaning (in Urdu script).
    3. Three incorrect but plausible meanings (decoys) (in Urdu script).`;

    const schema = {
        type: Type.OBJECT,
        properties: {
            muhavra: { type: Type.STRING },
            meaning: { type: Type.STRING },
            decoys: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["muhavra", "meaning", "decoys"]
    };

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: schema
            }
        });
        const jsonString = response.text.replace(/```json\n?|```/g, '').trim();
        return JSON.parse(jsonString);
    } catch (error) {
        console.error("Error generating Muhavra:", error);
        throw new Error("Failed to generate Muhavra.");
    }
};

export const generateWahidJamaChallenge = async (): Promise<{ word: string, type: 'wahid' | 'jama', counterpart: string }> => {
    const prompt = `Generate a singular (Wahid) or plural (Jama) Urdu word challenge.
    Select a word. Determine if it is Wahid or Jama. Provide its counterpart.
    Output JSON.`;

    const schema = {
        type: Type.OBJECT,
        properties: {
            word: { type: Type.STRING, description: "The word to question" },
            type: { type: Type.STRING, enum: ["wahid", "jama"], description: "Whether 'word' is singular or plural" },
            counterpart: { type: Type.STRING, description: "The answer (if word is wahid, this is jama, and vice versa)" }
        },
        required: ["word", "type", "counterpart"]
    };

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: schema
            }
        });
        const jsonString = response.text.replace(/```json\n?|```/g, '').trim();
        return JSON.parse(jsonString);
    } catch (error) {
        console.error("Error generating Wahid Jama:", error);
        throw new Error("Failed to generate challenge.");
    }
};

export const validateRomanUrdu = async (input: string, target: string): Promise<boolean> => {
    const prompt = `Does the Roman Urdu/English input "${input}" phonetically or semantically match the Urdu word "${target}"?
    Return a boolean true/false JSON.`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: { match: { type: Type.BOOLEAN } },
                    required: ["match"]
                }
            }
        });
        const jsonString = response.text.replace(/```json\n?|```/g, '').trim();
        return JSON.parse(jsonString).match;
    } catch (error) {
        console.error("Error validating Roman Urdu:", error);
        return false;
    }
};

export const generateTashreehChallenge = async (): Promise<{ proverb: string, meaning: string, decoys: string[] }> => {
    const prompt = `Generate an Urdu Proverb (Zarb-ul-Misal).
    Provide:
    1. The Proverb (in Urdu script).
    2. Its correct explanation/Tashreeh (in Urdu script).
    3. Three incorrect explanations (decoys) (in Urdu script).`;

    const schema = {
        type: Type.OBJECT,
        properties: {
            proverb: { type: Type.STRING },
            meaning: { type: Type.STRING },
            decoys: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["proverb", "meaning", "decoys"]
    };

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: schema
            }
        });
        const jsonString = response.text.replace(/```json\n?|```/g, '').trim();
        return JSON.parse(jsonString);
    } catch (error) {
        console.error("Error generating Tashreeh:", error);
        throw new Error("Failed to generate Tashreeh.");
    }
};

// --- LIVE LECTURE ---

export const generateLectureScript = async (subject: string, topic: string, duration: string): Promise<string[]> => {
    let partCount = 5;
    if (duration === 'Medium') partCount = 8;
    if (duration === 'Long') partCount = 12;

    const prompt = `
        You are an engaging teacher giving a lecture on "${topic}" for the subject "${subject}".
        Create a lecture script divided into exactly ${partCount} distinct parts or paragraphs.
        Each part should be 2-4 sentences long, clear, and easy to understand when spoken.
        The tone should be educational, encouraging, and enthusiastic. Use simple English vocabulary.
        Return the response as a JSON object with a "script" property which is an array of strings (the parts).
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        script: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING }
                        }
                    },
                    required: ["script"]
                }
            }
        });
        const jsonString = response.text.replace(/```json\n?|```/g, '').trim();
        return JSON.parse(jsonString).script;
    } catch (error) {
        console.error("Error generating lecture script:", error);
        throw new Error("Failed to generate lecture script.");
    }
};

export const textToSpeech = async (text: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: 'Kore' },
                    },
                },
            },
        });

        const audioData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (audioData) {
            return audioData;
        }
        throw new Error("No audio data returned");
    } catch (error) {
        console.error("Error generating speech:", error);
        throw new Error("Failed to generate speech.");
    }
};

// --- CUSTOM ACHIEVEMENTS ---

const achievementValidationSchema = {
    type: Type.OBJECT,
    properties: {
        isValid: { type: Type.BOOLEAN, description: "Whether the achievement goal is realistic, measurable, and related to study/learning/quiz apps." },
        reason: { type: Type.STRING, description: "Reason why valid or invalid." },
        suggestedXP: { type: Type.INTEGER, description: "Suggested XP reward based on difficulty (100-5000)." },
        shortTitle: { type: Type.STRING, description: "A catchy 2-3 word title for the badge." }
    },
    required: ["isValid", "reason", "suggestedXP", "shortTitle"]
};

export const validateAchievement = async (goal: string): Promise<{ isValid: boolean; reason: string; suggestedXP: number; shortTitle: string }> => {
    const prompt = `Analyze this user goal for a custom achievement in a study app: "${goal}".
    
    Determine if it is:
    1. Related to learning, studying, consistency, or quiz taking.
    2. Physically possible to achieve in a web app context.
    
    If valid, suggest an XP reward (100 for easy, up to 5000 for very hard) and a short title.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: achievementValidationSchema
            }
        });
        const jsonString = response.text.trim();
        return JSON.parse(jsonString);
    } catch (error) {
        console.error("Error validating achievement:", error);
        throw new Error("Failed to validate achievement.");
    }
};
