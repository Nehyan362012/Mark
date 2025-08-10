
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { HISTORY_EVENTS, ICONS } from '../constants';
import { HistoryHopEvent } from '../types';

const shuffleArray = (array: any[]) => [...array].sort(() => Math.random() - 0.5);

export const HistoryHopPage: React.FC = () => {
    const navigate = useNavigate();
    const [eventsToPlace, setEventsToPlace] = useState<HistoryHopEvent[]>([]);
    const [timelineSlots, setTimelineSlots] = useState<(HistoryHopEvent | null)[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<HistoryHopEvent | null>(null);
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);

    const sortedEvents = useMemo(() => [...HISTORY_EVENTS].sort((a, b) => a.year - b.year), []);

    useEffect(() => {
        setEventsToPlace(shuffleArray(HISTORY_EVENTS));
        setTimelineSlots(Array(HISTORY_EVENTS.length).fill(null));
    }, []);

    const handleSelectEvent = (event: HistoryHopEvent) => {
        setSelectedEvent(event);
    };

    const handlePlaceEvent = (index: number) => {
        if (!selectedEvent || timelineSlots[index]) return;

        // Place the event
        const newSlots = [...timelineSlots];
        newSlots[index] = selectedEvent;
        setTimelineSlots(newSlots);

        // Remove from list
        setEventsToPlace(eventsToPlace.filter(e => e.id !== selectedEvent.id));
        setSelectedEvent(null);
    };
    
    const checkAnswers = () => {
        let correctCount = 0;
        timelineSlots.forEach((placedEvent, index) => {
            if (placedEvent && placedEvent.id === sortedEvents[index].id) {
                correctCount++;
            }
        });
        setScore(correctCount);
        setGameOver(true);
    };
    
    const resetGame = () => {
        setEventsToPlace(shuffleArray(HISTORY_EVENTS));
        setTimelineSlots(Array(HISTORY_EVENTS.length).fill(null));
        setSelectedEvent(null);
        setGameOver(false);
        setScore(0);
    }

    if (gameOver) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in">
                <div className="bg-card-light dark:bg-card-dark p-8 rounded-2xl shadow-xl w-full max-w-lg">
                    <h2 className="text-4xl font-bold">Results</h2>
                    <p className="text-2xl mt-4">You correctly placed <span className="font-bold text-primary-light dark:text-primary-dark">{score}</span> out of {HISTORY_EVENTS.length} events!</p>
                    <div className="mt-6 text-left space-y-2">
                        <h3 className="font-bold text-lg">Correct Order:</h3>
                        {sortedEvents.map((event, index) => (
                             <div key={event.id} className={`p-2 rounded-lg flex justify-between ${timelineSlots[index]?.id === event.id ? 'bg-success/20' : 'bg-danger/20'}`}>
                                <span>{index + 1}. {event.text} ({event.year})</span>
                                <span>{timelineSlots[index]?.id === event.id ? '✓' : '✗'}</span>
                             </div>
                        ))}
                    </div>
                    <div className="flex gap-4 mt-8">
                        <button onClick={resetGame} className="flex-1 px-6 py-3 font-bold text-primary-light dark:text-primary-dark bg-primary-light/10 hover:bg-primary-light/20 rounded-lg shadow-md">
                            Play Again
                        </button>
                        <button 
                            onClick={() => navigate('/puzzle-hub')} 
                            className="flex-1 px-6 py-3 font-bold text-white bg-gradient-to-r from-primary-light to-secondary-light dark:from-primary-dark dark:to-secondary-dark rounded-lg shadow-md hover:opacity-90"
                        >
                            Back to Hub
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto animate-fade-in">
             <h2 className="text-center text-3xl font-bold mb-2">History Hop</h2>
             <p className="text-center text-subtle-dark dark:text-subtle-light mb-6">Place the events in chronological order, from earliest to most recent.</p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Events to Place */}
                <div className="lg:col-span-1 bg-card-light dark:bg-card-dark p-6 rounded-2xl shadow-lg">
                    <h3 className="text-xl font-bold mb-4">Events to Place</h3>
                    <div className="space-y-3">
                        {eventsToPlace.map(event => (
                            <button
                                key={event.id}
                                onClick={() => handleSelectEvent(event)}
                                className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${selectedEvent?.id === event.id ? 'bg-primary-light text-white ring-2 ring-primary-dark' : 'bg-bg-light dark:bg-bg-dark hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                            >
                                {event.text}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Timeline */}
                <div className="lg:col-span-2 bg-card-light dark:bg-card-dark p-6 rounded-2xl shadow-lg">
                     <h3 className="text-xl font-bold mb-4">Timeline</h3>
                     <div className="space-y-3">
                        {timelineSlots.map((slot, index) => (
                            <div key={index} className="flex items-center gap-4">
                                <span className="font-bold text-lg text-subtle-dark dark:text-subtle-light">{index + 1}.</span>
                                <button
                                    onClick={() => handlePlaceEvent(index)}
                                    disabled={!selectedEvent || !!slot}
                                    className="w-full h-14 p-3 rounded-lg border-2 border-dashed border-border-light dark:border-border-dark flex items-center justify-center transition-colors disabled:cursor-not-allowed hover:enabled:bg-primary-light/10 hover:enabled:border-primary-light"
                                >
                                    {slot ? (
                                        <span className="font-semibold">{slot.text} <span className="font-normal text-subtle-dark dark:text-subtle-light">({slot.year})</span></span>
                                    ) : (
                                        <span className="text-subtle-dark dark:text-subtle-light">{selectedEvent ? 'Place here' : 'Select an event'}</span>
                                    )}
                                </button>
                            </div>
                        ))}
                     </div>
                </div>
            </div>
            
            {eventsToPlace.length === 0 && (
                 <div className="text-center mt-8 animate-pop-in">
                    <button onClick={checkAnswers} className="px-10 py-4 text-xl font-bold text-white bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg shadow-xl hover:opacity-90">
                        Check My Answers!
                    </button>
                </div>
            )}
        </div>
    );
};
