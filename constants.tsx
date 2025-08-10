
import React from 'react';
import { Quiz, QuizQuestion, LeaderboardUser, Achievement, VocabVoyageWord, HistoryHopEvent, ElementData, CountryCapital, PhysicsPuzzle, Species, Theme, PaperStyle, CountryFlag, GrammarQuestion, ChemCompound, PhysicsFormula, CodeCommanderLevel, ArtPiece, TranslationPair, AnatomyPart, MusicalInstrument, ServerTechQuestion, LiteraryQuote, PuzzleInfo, Note } from './types';

export const ICONS = {
  home: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>,
  notes: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.75V16.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 16.5V3.75m9 0a2.25 2.25 0 0 0-2.25-2.25H9A2.25 2.25 0 0 0 6.75 3.75m9 0a2.25 2.25 0 0 1 2.25 2.25v10.5A2.25 2.25 0 0 1 15.75 19.5H8.25A2.25 2.25 0 0 1 6 17.25V6.375a2.25 2.25 0 0 1 2.25-2.25m4.5 0h-3.375" /></svg>,
  plusCircle: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>,
  quiz: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" /></svg>,
  progress: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" /></svg>,
  leaderboard: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" /></svg>,
  star: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" /></svg>,
  menuOpen: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>,
  menuClose: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>,
  logo: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg>,
  collection: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>,
  upload: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" /></svg>,
  achievements: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9a9 9 0 1 1 9 0Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 15.75V18.75m0 0v2.25m0-2.25h1.5m-1.5 0h-1.5m-6 0h.008v.008H6v-.008Zm12 0h.008v.008h-.008v-.008Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75c0 1.242 1.008 2.25 2.25 2.25s2.25-1.008 2.25-2.25" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 3.75v3" /><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 7.5h7.5" /></svg>,
  check: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>,
  briefcase: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.05a2.25 2.25 0 0 1-2.25-2.25h-12a2.25 2.25 0 0 1-2.25-2.25v-4.05m16.5-.75V9.6a2.25 2.25 0 0 0-2.25-2.25h-12A2.25 2.25 0 0 0 3.75 9.6v3.8m16.5-3.8V6.75A2.25 2.25 0 0 0 18 4.5h-1.5a2.25 2.25 0 0 0-2.25 2.25v.75A2.25 2.25 0 0 1 12 9.75h0a2.25 2.25 0 0 1-2.25-2.25V7.5A2.25 2.25 0 0 0 7.5 4.5H6A2.25 2.25 0 0 0 3.75 6.75v3.15" /></svg>,
  lock: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" /></svg>,
  puzzle: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M14.25 6.087c0-.66.537-1.197 1.197-1.197h.006c.66 0 1.197.537 1.197 1.197v7.506c0 .66-.537 1.197-1.197 1.197h-.006c-.66 0-1.197-.537-1.197-1.197V6.087Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M6.087 15.75c-.66 0-1.197-.537-1.197-1.197v-.006c0-.66.537-1.197 1.197-1.197h10.506c.66 0 1.197.537 1.197 1.197v.006c0 .66-.537 1.197-1.197 1.197H6.087Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M6.087 8.25c-.66 0-1.197-.537-1.197-1.197V6.087c0-.66.537-1.197 1.197-1.197h.006c.66 0 1.197.537 1.197 1.197v.959c0 .66-.537 1.197-1.197 1.197h-.006Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15.75c-.66 0-1.197-.537-1.197-1.197v-.006c0-.66.537-1.197 1.197-1.197h.006c.66 0 1.197.537 1.197 1.197v.006c0 .66-.537 1.197-1.197 1.197h-.006Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Z" /></svg>,
  studyBuddy: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" /></svg>,
  flame: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.362-3.797A8.33 8.33 0 0 1 12 6c1.23 0 2.398.404 3.362 1.098Z" /></svg>,
  brain: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" /></svg>,
  heart: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>,
  sparkles: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" /></svg>,
  sun: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" /></svg>,
  moon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" /></svg>,
  xp: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.372 7.5h3.248A1.125 1.125 0 0 1 20.25 8.625v4.5a1.125 1.125 0 0 1-1.125 1.125h-3.248m-3.248 0H9.75M12.75 7.5h-3M12.75 14.25v-7.5" /><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 15.75V8.25a1.5 1.5 0 0 1 1.5-1.5h4.5a1.5 1.5 0 0 1 1.5 1.5v7.5a1.5 1.5 0 0 1-1.5-1.5h-4.5a1.5 1.5 0 0 1-1.5-1.5Z" /></svg>,
  robot: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" /></svg>,
  server: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 17.25v-.228a4.5 4.5 0 00-.12-1.03l-2.268-9.64a3.375 3.375 0 00-3.285-2.602H7.923a3.375 3.375 0 00-3.285 2.602l-2.268 9.64a4.5 4.5 0 00-.12 1.03v.228m15.459 0a2.25 2.25 0 01-2.25 2.25h-10.5a2.25 2.25 0 01-2.25-2.25m15 0h-15M5.625 17.25v-1.5a2.25 2.25 0 012.25-2.25h8.25a2.25 2.25 0 012.25 2.25v1.5" /></svg>,
  target: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-3.36V4.842a14.982 14.982 0 0 0-6.16 3.36m0 0a14.982 14.982 0 0 1-6.16-3.36V4.842a14.982 14.982 0 0 1 6.16 3.36m0 0a14.982 14.982 0 0 0-6.16 3.36v6.252a14.982 14.982 0 0 0 6.16-3.36M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18Z" /></svg>,
  flag: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 21v-6m0 0 2.77-.693a9 9 0 0 1 6.208.682l.108.054a9 9 0 0 0 6.086.71l3.114-.732a48.524 48.524 0 0 1-.005-10.499l-3.11.732a9 9 0 0 1-6.085-.711l-.108-.054a9 9 0 0 0-6.208-.682L3 4.5M3 15V4.5" /></svg>,
  globe: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 0 1 0-18h.01a9 9 0 0 1 0 18h-.01Zm-1.07-5.93a9 9 0 0 0 4.14-4.14m-4.14 4.14a9 9 0 0 1-4.14-4.14" /></svg>,
  spy: <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM7.64 6.36c.26-.26.54-.48.84-.68.3-.2.62-.37.96-.51.34-.14.7-.23 1.06-.28.37-.06.74-.08 1.12-.08.37 0 .74.03 1.1.08.36.05.72.14 1.06.28.34.14.66.31.96.51.3.2.58.42.84.68.26.26.5.54.71.84.2.3.37.62.51.96.14.34.23.7.28 1.06.06.37.08.74.08 1.12 0 .37-.03.74-.08 1.1-.05.36-.14.72-.28 1.06-.14.34-.31.66-.51.96-.2.3-.42.58-.68.84-.26.26-.54.5-.84.71-.3.2-.62.37-.96.51-.34-.14-.7.23-1.06.28-.37.06-.74-.08-1.12-.08-.37 0-.74-.03-1.1-.08-.36-.05-.72-.14-1.06-.28-.34-.14-.66-.31-.96-.51-.3-.2-.58-.42-.84-.68-.26-.26-.5-.54-.71-.84-.2-.3-.37-.62-.51-.96-.14-.34-.23-.7-.28-1.06-.06-.37-.08-.74-.08-1.12s.03-.74.08-1.1c.05-.36.14-.72.28-1.06.14-.34.31.66.51-.96.2-.3.42-.58.68-.84zM12 8c-1.3 0-2.42.6-3.18 1.5c-.3.36-.46.79-.46 1.25c0 .9-.54 1.76-1.31 2.16c-.49.25-.85.76-.85 1.34c0 .83.67 1.5 1.5 1.5h8.6c.83 0 1.5-.67 1.5-1.5c0-.58-.36-1.09-.85-1.34c-.77-.4-1.31-1.26-1.31-2.16c0-.46-.16-.89-.46-1.25C14.42 8.6 13.3 8 12 8zm-1.5 4h3c.28 0 .5.22.5.5s-.22.5-.5.5h-3c-.28 0-.5-.22-.5-.5s.22-.5.5-.5z"/></svg>,
  search: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>,
  settings: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.24-.438.613-.43.992a6.759 6.759 0 0 1 0 1.255c-.008.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.6 6.6 0 0 1-.22.128c-.333.183-.582.495-.644.869l-.213 1.28c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.063-.374-.313-.686-.645-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.075-.124l-1.217.456a1.125 1.125 0 0 1-1.37-.49l-1.296-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43.992a6.759 6.759 0 0 1 0-1.255c.008-.378-.138.75-.43-.99l-1.004-.828a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.49l1.217.456c.355.133.75.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.213-1.28Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>,
  profile: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg>,
  close: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>,
  lightbulb: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.354a15.055 15.055 0 0 1-4.5 0M12 3v.75m0 16.5v.75m3.75-18v.75M7.5 21v.75M3 12h.75m16.5 0h.75m-18-3.75h.75m16.5 0h.75M5.636 5.636l.53.53m11.314 11.314.53.53m-12.374 0 .53-.53m11.314-11.314.53-.53" /></svg>,
  feedback: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" /></svg>,
  themes: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.258-.813A59.906 59.906 0 0112 3.493a59.903 59.903 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0l-3.232-1.928a60.437 60.437 0 01-1.254-4.288 48.627 48.627 0 0111.488-3.142 48.627 48.627 0 0111.488 3.142 60.437 60.437 0 01-1.254 4.288l-3.232 1.928" /></svg>,
  timer: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>,
  arrowRight: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>,
  arrowLeft: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>,
  flask: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M10.211 4.21c.264-.17.553-.27.854-.27s.59.1.854.27l4.437 2.822a1.125 1.125 0 0 1 .437 1.486l-4.437 7.099a1.125 1.125 0 0 1-1.5 0L5.337 8.518a1.125 1.125 0 0 1 .437-1.486l4.437-2.822ZM8.625 9.75h6.75M12 12.75v6.75" /></svg>,
  bookOpen: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18c-2.305 0-4.408.867-6 2.292m0-14.25v14.25" /></svg>,
  palette: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" /></svg>,
  atom: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5" /></svg>,
  language: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 0 1 6-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C13.18 7.363 13 8.182 13 9c0 1.773.82 3.34 2.067 4.333m-4.25 2.5a2.25 2.25 0 01-2.25-2.25V3.75m0 5.25a2.25 2.25 0 00-2.25-2.25H3.75" /></svg>,
  musicalNote: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V7.5A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.75" /></svg>,
  draw: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" /></svg>,
  highlight: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M5.25 12h.008v.008H5.25V12Zm3.75 0h.008v.008H9V12Zm3.75 0h.008v.008h-.008V12Z" /></svg>,
  list: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15.004h7.5m-7.5-3h7.5m-7.5-3h7.5M3 12l3 3-3 3" /></svg>,
  dotsVertical: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" /></svg>,
  classroom: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m-7.286 2.72a3 3 0 0 1-4.682-2.72 9.094 9.094 0 0 1 3.741-.479m7.286 2.72a3 3 0 0 0-7.286 0M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-4.5 4.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm13.5 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-4.5-4.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" /></svg>,
  studyPlanner: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0h18M12 12.75h.008v.008H12v-.008Zm0 4.5h.008v.008H12v-.008Zm4.5-4.5h.008v.008h-.008v-.008Zm-8.25 0h.008v.008h-.008V12.75Z" /></svg>,
  friends: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.53-2.473M15 19.128v-3.873m0 3.873a3.375 3.375 0 0 1-3.375-3.375M9 21.75a8.966 8.966 0 0 1-.53-1.785m.53 1.785a3.375 3.375 0 0 1-3.375-3.375m0 0c0-1.864 1.51-3.375 3.375-3.375s3.375 1.511 3.375 3.375m-6.75 0a3.375 3.375 0 0 1 3.375-3.375m-3.375 3.375a3.375 3.375 0 0 1-3.375-3.375m6.75 0v-3.375c0-1.864-1.51-3.375-3.375-3.375S3.75 9.136 3.75 11.25v3.375m6.75 0Zm-3.375 0c-1.864 0-3.375 1.511-3.375 3.375M15 12a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Z" /></svg>,
  cube: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" /></svg>,
  calculator: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V13.5Zm0 2.25h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V18Zm2.498-6.75h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007V18Zm2.504-6.75h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V13.5Zm0 2.25h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V18Zm2.498-6.75h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V13.5ZM8.25 6h7.5v2.25h-7.5V6ZM21 12a9 9 0 11-18 0 9 9 0 0118 0Z" /></svg>,
  pie: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z" /></svg>,
  ruler: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.75V16.5m-9-12.75V16.5m0 0L4.5 21m0-4.5L7.5 12m0 4.5L10.5 21m0-4.5L13.5 12m0 4.5L16.5 21m0-4.5L19.5 12m-9 0h9" /></svg>,
  paperclip: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.122 2.122l7.81-7.81" /></svg>,
};

export const SUBJECTS = [
    "Maths", "English", "Science", "History", "Geography", "Physics", "Chemistry", "Biology", "Computer Science", "Web Development", "English Literature", "Islamic Studies", "Urdu", "Social Studies", "General Knowledge", "Calculus", "Art History", "Music",
    "Economics", "Psychology", "Philosophy", "Political Science", "Statistics", "Accounting", "Astronomy"
];

export const PERSONA_SUBJECTS = ["Maths", "English", "Science", "History", "Urdu", "Computer Science"];
export const PROFICIENCY_LEVELS = ["Beginner", "I know the basics", "I'm pretty good", "Expert"];

export const GRADE_LEVELS = [
    "1st Grade", "2nd Grade", "3rd Grade", "4th Grade", "5th Grade", "6th Grade", "7th Grade", "8th Grade", "9th Grade", "10th Grade", "11th Grade", "12th Grade", 
    "University First Year", "University Second Year", "University Third Year", "University Fourth Year", "Expert"
];

export const SUBJECT_COLORS: { [key: string]: string } = {
    'Maths': 'border-l-4 border-blue-500',
    'English': 'border-l-4 border-rose-500',
    'Science': 'border-l-4 border-green-500',
    'History': 'border-l-4 border-amber-500',
    'Geography': 'border-l-4 border-emerald-500',
    'Physics': 'border-l-4 border-indigo-500',
    'Chemistry': 'border-l-4 border-cyan-500',
    'Biology': 'border-l-4 border-lime-500',
    'Computer Science': 'border-l-4 border-gray-600',
    'Web Development': 'border-l-4 border-pink-500',
    'English Literature': 'border-l-4 border-purple-500',
    'Islamic Studies': 'border-l-4 border-teal-500',
    'Urdu': 'border-l-4 border-green-700',
    'Social Studies': 'border-l-4 border-orange-500',
    'Calculus': 'border-l-4 border-fuchsia-500',
    'General Knowledge': 'border-l-4 border-slate-500',
    'Art History': 'border-l-4 border-red-400',
    'Music': 'border-l-4 border-sky-400',
    'Economics': 'border-l-4 border-teal-700',
    'Psychology': 'border-l-4 border-violet-500',
    'Philosophy': 'border-l-4 border-stone-500',
    'Political Science': 'border-l-4 border-blue-800',
    'Statistics': 'border-l-4 border-cyan-700',
    'Accounting': 'border-l-4 border-lime-700',
    'Astronomy': 'border-l-4 border-indigo-800',
    'Default': 'border-l-4 border-slate-500',
};

export const MOCK_LEADERBOARD: LeaderboardUser[] = [
  { rank: 1, name: 'Fatima Khan', xp: 15100, avatar: 'https://api.dicebear.com/8.x/lorelei/svg?seed=fatima', level: 15, quizzesTaken: 52 },
  { rank: 2, name: 'Aisha Ahmed', xp: 12450, avatar: 'https://api.dicebear.com/8.x/lorelei/svg?seed=aisha', level: 12, quizzesTaken: 45 },
  { rank: 3, name: 'Hassan Ali', xp: 11500, avatar: 'https://api.dicebear.com/8.x/lorelei/svg?seed=hassan', level: 11, quizzesTaken: 38 },
  { rank: 4, name: 'Usman Tariq', xp: 10200, avatar: 'https://api.dicebear.com/8.x/lorelei/svg?seed=usman', level: 10, quizzesTaken: 41 },
  { rank: 5, name: 'Bilal Chaudhry', xp: 9800, avatar: 'https://api.dicebear.com/8.x/lorelei/svg?seed=bilal', level: 9, quizzesTaken: 33 },
  { rank: 6, name: 'Zainab Malik', xp: 8300, avatar: 'https://api.dicebear.com/8.x/lorelei/svg?seed=zainab', level: 8, quizzesTaken: 29 },
  { rank: 7, name: 'Hira Shah', xp: 7600, avatar: 'https://api.dicebear.com/8.x/lorelei/svg?seed=hira', level: 7, quizzesTaken: 25 },
  { rank: 8, name: 'Faisal Jameel', xp: 6800, avatar: 'https://api.dicebear.com/8.x/lorelei/svg?seed=faisal', level: 6, quizzesTaken: 22 },
  { rank: 9, name: 'Sana Iqbal', xp: 5900, avatar: 'https://api.dicebear.com/8.x/lorelei/svg?seed=sana', level: 5, quizzesTaken: 19 },
  { rank: 10, name: 'Imran Butt', xp: 5200, avatar: 'https://api.dicebear.com/8.x/lorelei/svg?seed=imran', level: 5, quizzesTaken: 17 },
  { rank: 11, name: 'Mariam Ansari', xp: 4500, avatar: 'https://api.dicebear.com/8.x/lorelei/svg?seed=mariam', level: 4, quizzesTaken: 15 },
  { rank: 12, name: 'Haris Qureshi', xp: 3800, avatar: 'https://api.dicebear.com/8.x/lorelei/svg?seed=haris', level: 3, quizzesTaken: 12 },
];

const MANUAL_MOCK_COMMUNITY_QUIZZES: Quiz[] = [
    { id: 'comm_q1', title: 'Biology Basics: The Cell', subject: 'Biology', author: 'Sadia Ahmed', authorId: 'user_sadia', isPublic: true, grade: '9th Grade', questions: [
            { question: 'What is the powerhouse of the cell?', type: 'multiple-choice', options: ['Nucleus', 'Mitochondrion', 'Ribosome', 'Cell Wall'], correctAnswer: 'Mitochondrion' },
            { question: 'Where is the genetic material (DNA) found in a eukaryotic cell?', type: 'multiple-choice', options: ['Cytoplasm', 'Mitochondrion', 'Nucleus', 'Vacuole'], correctAnswer: 'Nucleus' },
            { question: 'What is the function of ribosomes?', type: 'fill-in-the-blank', correctAnswer: 'Protein synthesis' },
            { question: 'Which organelle is responsible for photosynthesis in plant cells?', type: 'multiple-choice', options: ['Chloroplast', 'Golgi Apparatus', 'Endoplasmic Reticulum', 'Lysosome'], correctAnswer: 'Chloroplast' },
            { question: 'The cell membrane is primarily composed of a bilayer of which molecules?', type: 'fill-in-the-blank', correctAnswer: 'Phospholipids' },
            { question: 'What is the rigid outer layer of a plant cell called?', type: 'multiple-choice', options: ['Cell Membrane', 'Cytoskeleton', 'Cell Wall', 'Nucleolus'], correctAnswer: 'Cell Wall' },
            { question: 'Which process describes the movement of water across a semi-permeable membrane?', type: 'multiple-choice', options: ['Diffusion', 'Active Transport', 'Endocytosis', 'Osmosis'], correctAnswer: 'Osmosis' },
            { question: 'What is the jelly-like substance that fills the cell?', type: 'fill-in-the-blank', correctAnswer: 'Cytoplasm' },
            { question: 'Lysosomes are responsible for what cellular function?', type: 'multiple-choice', options: ['Energy production', 'Waste breakdown and recycling', 'Protein folding', 'Lipid synthesis'], correctAnswer: 'Waste breakdown and recycling' },
            { question: 'Prokaryotic cells, like bacteria, lack a true what?', type: 'fill-in-the-blank', correctAnswer: 'Nucleus' }
    ] },
    { id: 'comm_q2', title: 'World War II Trivia', subject: 'History', author: 'Ali Raza', authorId: 'user_ali', isPublic: true, grade: '10th Grade', questions: [
        { question: 'What year did WWII begin?', type: 'fill-in-the-blank', correctAnswer: '1939' },
        { question: 'The invasion of which country by Germany triggered the start of WWII?', type: 'multiple-choice', options: ['France', 'Poland', 'Russia', 'Austria'], correctAnswer: 'Poland' },
        { question: 'What was the code name for the Allied invasion of Normandy in 1944?', type: 'multiple-choice', options: ['Operation Barbarossa', 'Operation Market Garden', 'Operation Overlord', 'Operation Torch'], correctAnswer: 'Operation Overlord' },
        { question: 'Which U.S. naval base was attacked by Japan on December 7, 1941?', type: 'fill-in-the-blank', correctAnswer: 'Pearl Harbor' },
        { question: 'Who was the Prime Minister of the United Kingdom for most of WWII?', type: 'multiple-choice', options: ['Neville Chamberlain', 'Clement Attlee', 'Winston Churchill', 'Anthony Eden'], correctAnswer: 'Winston Churchill' },
        { question: 'The Battle of Stalingrad was a major turning point on which front?', type: 'multiple-choice', options: ['Western Front', 'Eastern Front', 'Pacific Theater', 'North African Campaign'], correctAnswer: 'Eastern Front' },
        { question: 'What was the "Manhattan Project"?', type: 'fill-in-the-blank', correctAnswer: 'The project to develop the atomic bomb' },
        { question: 'Which two Japanese cities were atomic bombs dropped on to end the war?', type: 'multiple-choice', options: ['Tokyo and Kyoto', 'Osaka and Kobe', 'Hiroshima and Nagasaki', 'Yokohama and Sapporo'], correctAnswer: 'Hiroshima and Nagasaki' },
        { question: 'What term is used to describe the systematic, state-sponsored persecution and murder of six million Jews by the Nazi regime?', type: 'fill-in-the-blank', correctAnswer: 'The Holocaust' },
        { question: 'Which three leaders formed the "Big Three" alliance?', type: 'multiple-choice', options: ['Churchill, Roosevelt, Stalin', 'Hitler, Mussolini, Tojo', 'De Gaulle, Roosevelt, Churchill', 'Stalin, Truman, Attlee'], correctAnswer: 'Churchill, Roosevelt, Stalin' },
        { question: 'What was the German air force called?', type: 'fill-in-the-blank', correctAnswer: 'Luftwaffe' },
        { question: 'The Battle of Britain was fought primarily in what domain?', type: 'multiple-choice', options: ['Land', 'Sea', 'Air', 'Underground'], correctAnswer: 'Air' }
    ]},
    { id: 'comm_q3', title: 'Python Programming 101', subject: 'Computer Science', author: 'Zeeshan Khan', authorId: 'user_zeeshan', isPublic: true, grade: '11th Grade', questions: [
        { question: 'What keyword is used to define a function in Python?', type: 'multiple-choice', options: ['func', 'def', 'function', 'define'], correctAnswer: 'def' },
        { question: 'Which data type is used to store a sequence of characters?', type: 'fill-in-the-blank', correctAnswer: 'string' },
        { question: 'In Python, what is the result of 10 / 3?', type: 'multiple-choice', options: ['3', '3.333...', '3.0', '4'], correctAnswer: '3.333...' },
        { question: 'What is the correct way to write a single-line comment in Python?', type: 'multiple-choice', options: ['// This is a comment', '/* This is a comment */', '# This is a comment', '<!-- This is a comment -->'], correctAnswer: '# This is a comment' },
        { question: 'What method would you use to find the number of items in a list called `my_list`?', type: 'fill-in-the-blank', correctAnswer: 'len(my_list)' },
        { question: 'Which of the following is an immutable data type in Python?', type: 'multiple-choice', options: ['list', 'dictionary', 'set', 'tuple'], correctAnswer: 'tuple' },
        { question: 'What does the `if __name__ == "__main__":` block do?', type: 'multiple-choice', options: ['Defines the main function', 'It is a syntax error', 'Allows code to be run only when the script is executed directly', 'Imports the main module'], correctAnswer: 'Allows code to be run only when the script is executed directly' },
        { question: 'How do you create a list in Python?', type: 'fill-in-the-blank', correctAnswer: '[] or list()' },
        { question: 'What is the output of `print("Hello"[1])`?', type: 'multiple-choice', options: ['H', 'e', 'l', 'o'], correctAnswer: 'e' },
        { question: 'Which loop is used for iterating over a sequence (like a list, tuple, or string)?', type: 'fill-in-the-blank', correctAnswer: 'for loop' },
    ]},
    { id: 'comm_q4', title: "Newton's Laws of Motion", subject: 'Physics', author: 'Sadia Ahmed', authorId: 'user_sadia', isPublic: true, grade: '12th Grade', questions: [
        { question: 'Which law is also known as the law of inertia?', type: 'fill-in-the-blank', correctAnswer: "First" },
        { question: 'The formula F = ma is a representation of which of Newton\'s laws?', type: 'multiple-choice', options: ["First Law", "Second Law", "Third Law", "Law of Gravitation"], correctAnswer: "Second Law" },
        { question: 'What does "F" stand for in the equation F = ma?', type: 'multiple-choice', options: ["Force", "Friction", "Frequency", "Foot-pounds"], correctAnswer: "Force" },
        { question: 'Newton\'s Third Law states that for every action, there is an equal and opposite _____.', type: 'fill-in-the-blank', correctAnswer: "reaction" },
        { question: 'If an object is at rest, what is its acceleration?', type: 'multiple-choice', options: ["9.8 m/s^2", "1 m/s^2", "0 m/s^2", "Cannot be determined"], correctAnswer: "0 m/s^2" },
        { question: 'A book resting on a table is an example of which law?', type: 'multiple-choice', options: ["First Law", "Third Law", "Both First and Third"], correctAnswer: "Both First and Third" },
        { question: 'If you push a heavy box and a light box with the same force, which one will accelerate more?', type: 'fill-in-the-blank', correctAnswer: "The light box" },
        { question: 'The unit of force is the Newton, which is equivalent to what base units?', type: 'multiple-choice', options: ["kg*m/s", "kg*s/m", "kg*m/s^2", "m/s^2"], correctAnswer: "kg*m/s^2" },
    ]},
    { id: 'comm_q5', title: 'Geography: World Capitals', subject: 'Geography', author: 'Ali Raza', authorId: 'user_ali', isPublic: true, grade: '8th Grade', questions: [
        { question: 'What is the capital of Australia?', type: 'multiple-choice', options: ['Sydney', 'Melbourne', 'Canberra', 'Perth'], correctAnswer: 'Canberra' },
        { question: 'What is the capital of Canada?', type: 'fill-in-the-blank', correctAnswer: 'Ottawa' },
        { question: 'Which city is the capital of Japan?', type: 'multiple-choice', options: ['Kyoto', 'Osaka', 'Tokyo', 'Hiroshima'], correctAnswer: 'Tokyo' },
        { question: 'What is the capital of Brazil?', type: 'fill-in-the-blank', correctAnswer: 'Brasilia' },
        { question: 'Which of these is the capital of Spain?', type: 'multiple-choice', options: ['Barcelona', 'Madrid', 'Seville', 'Valencia'], correctAnswer: 'Madrid' },
        { question: 'What is the capital of Egypt?', type: 'fill-in-the-blank', correctAnswer: 'Cairo' },
        { question: 'What is the capital of Russia?', type: 'multiple-choice', options: ['Saint Petersburg', 'Moscow', 'Kazan', 'Novosibirsk'], correctAnswer: 'Moscow' },
        { question: 'What is the capital of Argentina?', type: 'fill-in-the-blank', correctAnswer: 'Buenos Aires' },
        { question: 'Which city is the capital of South Korea?', type: 'multiple-choice', options: ['Busan', 'Incheon', 'Seoul', 'Daegu'], correctAnswer: 'Seoul' },
        { question: 'What is the capital of Italy?', type: 'fill-in-the-blank', correctAnswer: 'Rome' },
    ]},
    { id: 'comm_q6', title: 'Literary Classics', subject: 'English Literature', author: 'Zeeshan Khan', authorId: 'user_zeeshan', isPublic: true, grade: 'University First Year', questions: [
        { question: 'Who wrote "Pride and Prejudice"?', type: 'fill-in-the-blank', correctAnswer: 'Jane Austen' },
        { question: 'In Shakespeare\'s "Romeo and Juliet", which family does Juliet belong to?', type: 'multiple-choice', options: ['Montague', 'Capulet', 'Verona', 'Escalus'], correctAnswer: 'Capulet' },
        { question: 'What is the name of the protagonist in "The Great Gatsby"?', type: 'fill-in-the-blank', correctAnswer: 'Jay Gatsby' },
        { question: 'Who is the author of the dystopian novel "1984"?', type: 'multiple-choice', options: ['Aldous Huxley', 'George Orwell', 'Ray Bradbury', 'Philip K. Dick'], correctAnswer: 'George Orwell' },
        { question: 'In "Moby Dick", what is the name of the captain of the Pequod?', type: 'fill-in-the-blank', correctAnswer: 'Ahab' },
        { question: '"It was the best of times, it was the worst of times" is the opening line of which Charles Dickens novel?', type: 'multiple-choice', options: ['Oliver Twist', 'Great Expectations', 'A Tale of Two Cities', 'David Copperfield'], correctAnswer: 'A Tale of Two Cities' },
        { question: 'Who wrote the epic poem "Paradise Lost"?', type: 'fill-in-the-blank', correctAnswer: 'John Milton' },
        { question: 'Which novel features the characters Atticus, Scout, and Jem Finch?', type: 'multiple-choice', options: ['The Catcher in the Rye', 'To Kill a Mockingbird', 'The Grapes of Wrath', 'Of Mice and Men'], correctAnswer: 'To Kill a Mockingbird' },
    ]},
    { id: 'comm_q7', title: 'The Solar System', subject: 'Science', author: 'Sadia Ahmed', authorId: 'user_sadia', isPublic: true, grade: '6th Grade', questions: [
        { question: 'Which planet is known as the Red Planet?', type: 'multiple-choice', options: ['Venus', 'Mars', 'Jupiter', 'Saturn'], correctAnswer: 'Mars' },
        { question: 'What is the largest planet in our solar system?', type: 'fill-in-the-blank', correctAnswer: 'Jupiter' },
        { question: 'Which planet is famous for its rings?', type: 'multiple-choice', options: ['Uranus', 'Jupiter', 'Saturn', 'Neptune'], correctAnswer: 'Saturn' },
        { question: 'What is the name of the star at the center of our solar system?', type: 'fill-in-the-blank', correctAnswer: 'The Sun' },
        { question: 'How many planets are in our solar system?', type: 'multiple-choice', options: ['7', '8', '9', '10'], correctAnswer: '8' },
        { question: 'Which planet is closest to the Sun?', type: 'fill-in-the-blank', correctAnswer: 'Mercury' },
        { question: 'What is the name of Earth\'s natural satellite?', type: 'fill-in-the-blank', correctAnswer: 'The Moon' },
        { question: 'Which planet is known for its Great Red Spot, a giant storm?', type: 'multiple-choice', options: ['Mars', 'Saturn', 'Jupiter', 'Neptune'], correctAnswer: 'Jupiter' },
        { question: 'What is the third planet from the Sun?', type: 'fill-in-the-blank', correctAnswer: 'Earth' },
        { question: 'Which two planets are known as "ice giants"?', type: 'multiple-choice', options: ['Jupiter and Saturn', 'Earth and Mars', 'Uranus and Neptune', 'Mercury and Venus'], correctAnswer: 'Uranus and Neptune' },
    ]},
];

export const MOCK_USERS = {
  user_sadia: { name: 'Sadia Ahmed', avatar: 'https://api.dicebear.com/8.x/lorelei/svg?seed=sadia' },
  user_zeeshan: { name: 'Zeeshan Khan', avatar: 'https://api.dicebear.com/8.x/lorelei/svg?seed=zeeshan' },
  user_ali: { name: 'Ali Raza', avatar: 'https://api.dicebear.com/8.x/lorelei/svg?seed=ali' },
  user_amna: { name: 'Amna Baig', avatar: 'https://api.dicebear.com/8.x/lorelei/svg?seed=amna' },
  user_omar: { name: 'Omar Farooq', avatar: 'https://api.dicebear.com/8.x/lorelei/svg?seed=omar' },
};

export const MOCK_COMMUNITY_NOTES: Note[] = [
    { id: 'comm_n1', title: 'Key Concepts of Photosynthesis', subject: 'Biology', content: '<h1>Photosynthesis Explained</h1><p>It\'s the process plants use to convert light energy into chemical energy.</p><h2>Formula</h2><p>6CO2 + 6H2O → C6H12O6 + 6O2</p>', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), authorId: 'user_sadia', isPublic: true },
    { id: 'comm_n2', title: 'Intro to Python Programming', subject: 'Computer Science', content: '<h1>Python Basics</h1><p>Python is a high-level, interpreted programming language.</p><h2>Variables</h2><p><code>x = 5</code></p><p><code>y = "Hello"</code></p>', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), authorId: 'user_zeeshan', isPublic: true },
];

const MOCK_AUTHORS = [
    { id: 'user_sadia', name: 'Sadia A.' },
    { id: 'user_zeeshan', name: 'Zeeshan K.' },
    { id: 'user_ali', name: 'Ali R.' },
    { id: 'user_amna', name: 'Amna B.' },
    { id: 'user_omar', name: 'Omar F.' }
];

const QUESTION_TEMPLATES: { [key: string]: (topic: string) => { question: string, correctAnswer: string, options?: string[] } } = {
    'Maths': () => {
        const num1 = Math.floor(Math.random() * 50) + 1;
        const num2 = Math.floor(Math.random() * 50) + 1;
        const answer = num1 + num2;
        return {
            question: `What is ${num1} + ${num2}?`,
            correctAnswer: `${answer}`,
            options: [
                `${answer}`,
                `${answer + Math.floor(Math.random() * 5) + 1}`,
                `${answer - Math.floor(Math.random() * 5) - 1}`,
                `${num1 + num2 + 10}`
            ].sort(() => Math.random() - 0.5)
        };
    },
    'History': () => {
        const year = Math.floor(Math.random() * 500) + 1500;
        const events = ['the signing of the Declaration of Independence', 'the Battle of Waterloo', 'the start of the Renaissance', 'the fall of Constantinople'];
        return {
            question: `Which major historical event occurred around the year ${year}?`,
            correctAnswer: `A significant development in the ${Math.floor(year/100)}00s`,
            options: [`A significant development in the ${Math.floor(year/100)}00s`, 'A minor skirmish', 'A royal wedding', 'The discovery of a new continent']
        };
    },
    'Science': () => {
        const elements: {[key: string]: string} = { 'Oxygen': 'O', 'Carbon': 'C', 'Hydrogen': 'H', 'Gold': 'Au', 'Iron': 'Fe' };
        const element = Object.keys(elements)[Math.floor(Math.random() * Object.keys(elements).length)];
        return {
            question: `What is the chemical symbol for ${element}?`,
            correctAnswer: elements[element],
            options: [elements[element], 'Ag', 'Pb', 'N'].sort(() => Math.random() - 0.5)
        };
    },
    'Default': (topic) => {
        return {
            question: `What is a key concept in ${topic}?`,
            correctAnswer: 'The main principle',
            options: ['The main principle', 'A related theory', 'An opposing idea', 'A minor detail']
        };
    }
};

const generateMockQuestions = (subject: string, count: number): QuizQuestion[] => {
    const questions: QuizQuestion[] = [];
    const templateFn = QUESTION_TEMPLATES[subject] || QUESTION_TEMPLATES['Default'];
    for (let i = 0; i < count; i++) {
        const { question, correctAnswer, options } = templateFn(subject);
        questions.push({
            id: i + 1,
            question: `${question} (Q${i+1})`,
            type: 'multiple-choice',
            options: options,
            correctAnswer: correctAnswer
        });
    }
    return questions;
};

const generateMockQuizzes = (count: number): Quiz[] => {
    const quizzes: Quiz[] = [];
    const usedTitles = new Set<string>();

    for (let i = 0; i < count; i++) {
        const subject = SUBJECTS[Math.floor(Math.random() * SUBJECTS.length)];
        const grade = GRADE_LEVELS[Math.floor(Math.random() * GRADE_LEVELS.length)];
        const questionCount = Math.floor(Math.random() * 41) + 10; // 10 to 50
        const author = MOCK_AUTHORS[Math.floor(Math.random() * MOCK_AUTHORS.length)];
        
        let title = `${subject} Challenge #${i + 1}`;
        if (usedTitles.has(title)) { 
            title = `${subject} Challenge #${i + 1} - ${Math.random().toString(36).substring(7)}`;
        }
        usedTitles.add(title);
        
        quizzes.push({
            id: `comm_q_gen_${i}`,
            title: title,
            subject: subject,
            author: author.name,
            authorId: author.id,
            isPublic: true,
            grade: grade,
            questions: generateMockQuestions(subject, questionCount)
        });
    }
    return quizzes;
};

export const MOCK_COMMUNITY_QUIZZES: Quiz[] = [...MANUAL_MOCK_COMMUNITY_QUIZZES, ...generateMockQuizzes(100)];

export const PUZZLES: PuzzleInfo[] = [
    { title: 'Math Blaster', description: 'Solve falling math problems before they reach the bottom.', subject: 'Maths', path: '/math-blaster', icon: ICONS.brain, cost: 0 },
    { title: 'Prime Patrol', description: 'Identify prime numbers in a grid before time runs out.', subject: 'Maths', path: '/prime-patrol', icon: ICONS.search, cost: 0 },
    { title: 'Fraction Attraction', description: 'Solve fraction arithmetic problems under pressure.', subject: 'Maths', path: '/fraction-attraction', icon: ICONS.pie, cost: 0 },
    { title: 'Decimal Dash', description: 'Pinpoint decimals on a number line with precision.', subject: 'Maths', path: '/decimal-dash', icon: ICONS.ruler, cost: 0 },
    { title: 'Equation Explorer', description: 'Solve for X in simple algebraic equations.', subject: 'Maths', path: '/equation-explorer', icon: ICONS.calculator, cost: 0 },
    { title: 'Sequence Solver', description: 'Find the next number in the logical sequence.', subject: 'Maths', path: '/sequence-solver', icon: ICONS.puzzle, cost: 0 },
];

export const URDU_PUZZLES: PuzzleInfo[] = [
    { title: 'Lafz Jodo', description: 'Connect letters to form Urdu words.', subject: 'Urdu', path: '/lafz-jodo', icon: ICONS.puzzle, cost: 0 },
    { title: 'Jumla Sazi', description: 'Unscramble words to make a correct sentence.', subject: 'Urdu', path: '/jumla-sazi', icon: ICONS.list, cost: 0 },
    { title: 'Harf Girao', description: 'Type the falling Urdu letters before they hit the bottom.', subject: 'Urdu', path: '/harf-girao', icon: ICONS.brain, cost: 0 },
    { title: 'Muhavra Pehchano', description: 'Match Urdu idioms with their correct meanings.', subject: 'Urdu', path: '/muhavra-pehchano', icon: ICONS.lightbulb, cost: 0 },
    { title: 'Wahid Jama', description: 'Identify singular and plural words.', subject: 'Urdu', path: '/wahid-jama', icon: ICONS.collection, cost: 0 },
    { title: 'Tashreeh Master', description: 'Explain the meaning of common Urdu proverbs.', subject: 'Urdu', path: '/tashreeh-master', icon: ICONS.bookOpen, cost: 0 },
];

export const XP_PER_LEVEL = 1000;

export const THEMES: Theme[] = [
    { name: 'Default', className: '', colors: { '--hue-primary': '257', '--hue-secondary': '283' }, cost: 0 },
    { name: 'Forest', className: 'theme-forest', colors: { '--hue-primary': '150', '--hue-secondary': '130' }, cost: 0 },
    { name: 'Nebula', className: 'theme-nebula', colors: { '--hue-primary': '220', '--hue-secondary': '310' }, cost: 0 },
    { name: 'Sunset', className: 'theme-sunset', colors: { '--hue-primary': '25', '--hue-secondary': '350' }, cost: 0 },
    { name: 'Sakura', className: 'theme-sakura', colors: { '--hue-primary': '340', '--hue-secondary': '320' }, cost: 0 },
    { name: 'Ocean', className: 'theme-ocean', colors: { '--hue-primary': '200', '--hue-secondary': '180' }, cost: 0 },
    { name: 'Crimson', className: 'theme-crimson', colors: { '--hue-primary': '0', '--hue-secondary': '340' }, cost: 0 },
    { name: 'Sunrise', className: 'theme-sunrise', colors: { '--hue-primary': '40', '--hue-secondary': '15' }, cost: 0 },
    { name: 'Mint', className: 'theme-mint', colors: { '--hue-primary': '160', '--hue-secondary': '175' }, cost: 0 },
    { name: 'Amethyst', className: 'theme-amethyst', colors: { '--hue-primary': '270', '--hue-secondary': '250' }, cost: 0 },
    { name: 'Gold', className: 'theme-gold', colors: { '--hue-primary': '45', '--hue-secondary': '35' }, cost: 0 },
    { name: 'Matrix', className: 'theme-matrix', colors: { '--hue-primary': '140', '--hue-secondary': '150' }, cost: 0 },
    { name: 'Cyber', className: 'theme-cyber', colors: { '--hue-primary': '180', '--hue-secondary': '280' }, cost: 0 },
];

export const PAPER_STYLES: PaperStyle[] = [
    { name: 'Default', className: 'paper-default', preview: 'bg-white dark:bg-slate-800' },
    { name: 'Lined', className: 'paper-lined', preview: 'paper-lined' },
    { name: 'Grid', className: 'paper-grid', preview: 'paper-grid' },
    { name: 'Dotted', className: 'paper-dotted', preview: 'paper-dotted' },
    { name: 'Vintage', className: 'paper-vintage', preview: 'paper-vintage' },
    { name: 'Blueprint', className: 'paper-blueprint', preview: 'paper-blueprint' },
    { name: 'Blackboard', className: 'paper-blackboard', preview: 'paper-blackboard' }
];

export const ACHIEVEMENTS: Achievement[] = [
    // General
    { id: 'first-quiz', name: 'Quiz Novice', description: 'Completed your first quiz.', icon: ICONS.quiz, unlocked: false },
    { id: 'perfect-score', name: 'Perfectionist', description: 'Achieved a 100% score on a quiz.', icon: ICONS.star, unlocked: false },
    { id: 'creator', name: 'Quiz Architect', description: 'Created your first custom quiz.', icon: ICONS.plusCircle, unlocked: false },
    { id: 'note-taker', name: 'Scribe', description: 'Created your first note.', icon: ICONS.notes, unlocked: false },
    { id: 'ai-friend', name: 'AI Conversationalist', description: 'Asked the Study Buddy for help.', icon: ICONS.studyBuddy, unlocked: false },
    { id: 'puzzle-starter', name: 'Puzzler', description: 'Played your first puzzle game.', icon: ICONS.puzzle, unlocked: false },
    { id: 'subject-pro', name: 'Subject Pro', description: 'Get 100% on 3 quizzes in the same subject.', icon: ICONS.achievements, unlocked: false },
    
    // Streak
    { id: 'streak-starter', name: 'On Fire!', description: 'Maintained a 2-day login streak.', icon: ICONS.flame, unlocked: false },
    { id: 'streak-week', name: 'Weekly Warrior', description: 'Maintained a 7-day login streak.', icon: ICONS.flame, unlocked: false },
    { id: 'streak-month', name: 'Monthly Master', description: 'Maintained a 30-day login streak.', icon: ICONS.flame, unlocked: false },
    
    // Math Arcade
    { id: 'math-whiz', name: 'Math Whiz', description: 'Reached a score of 1000 in Math Blaster.', icon: ICONS.brain, unlocked: false },
    { id: 'prime-patrol-pro', name: 'Prime Patroller', description: 'Score over 100 in Prime Patrol.', icon: ICONS.search, unlocked: false },
    { id: 'fraction-master', name: 'Fraction Master', description: 'Score over 100 in Fraction Flipper.', icon: ICONS.pie, unlocked: false },
    { id: 'decimal-dynamo', name: 'Decimal Dynamo', description: 'Score over 150 in Decimal Dash.', icon: ICONS.ruler, unlocked: false },
    { id: 'equation-expert', name: 'Equation Expert', description: 'Score over 200 in Equation Explorer.', icon: ICONS.calculator, unlocked: false },
    { id: 'sequence-sensei', name: 'Sequence Sensei', description: 'Score over 100 in Sequence Solver.', icon: ICONS.puzzle, unlocked: false },
];

// --- PUZZLE DATA ---

export const ELEMENT_DATA: ElementData[] = [
    { name: 'Hydrogen', symbol: 'H' },
    { name: 'Helium', symbol: 'He' },
    { name: 'Oxygen', symbol: 'O' },
    { name: 'Carbon', symbol: 'C' },
    { name: 'Nitrogen', symbol: 'N' },
    { name: 'Gold', symbol: 'Au' },
    { name: 'Silver', symbol: 'Ag' },
    { name: 'Iron', symbol: 'Fe' },
];

export const COUNTRY_CAPITALS: CountryCapital[] = [
    { country: 'France', capital: 'Paris' },
    { country: 'Germany', capital: 'Berlin' },
    { country: 'Japan', capital: 'Tokyo' },
    { country: 'Canada', capital: 'Ottawa' },
    { country: 'Brazil', capital: 'Brasilia' },
    { country: 'Egypt', capital: 'Cairo' },
];

export const PHYSICS_PUZZLES: PhysicsPuzzle[] = [
    { question: "What is the unit of force?", options: ["Watt", "Joule", "Newton", "Pascal"], correctAnswer: "Newton" },
    { question: "Which law states 'for every action, there is an equal and opposite reaction'?", options: ["Ohm's Law", "First Law of Motion", "Third Law of Motion", "Second Law of Motion"], correctAnswer: "Third Law of Motion" },
];

export const SPECIES_TO_SORT: Species[] = [
    { name: 'Dolphin', category: 'Mammal' },
    { name: 'Eagle', category: 'Bird' },
    { name: 'Snake', category: 'Reptile' },
    { name: 'Tuna', category: 'Fish' },
    { name: 'Frog', category: 'Amphibian' },
    { name: 'Ant', category: 'Insect' },
];

export const COUNTRY_FLAGS: CountryFlag[] = [
    { name: 'United States', code: 'us' },
    { name: 'France', code: 'fr' },
    { name: 'Germany', code: 'de' },
    { name: 'Japan', code: 'jp' },
    { name: 'Canada', code: 'ca' },
    { name: 'Brazil', code: 'br' },
];

export const GRAMMAR_QUESTIONS: GrammarQuestion[] = [
    { sentences: ["They're going to the park.", "Their going to the park.", "There going to the park."], correctSentence: "They're going to the park." },
    { sentences: ["Its a beautiful day.", "It's a beautiful day.", "Its' a beautiful day."], correctSentence: "It's a beautiful day." },
];

export const CHEM_COMPOUNDS: ChemCompound[] = [
    { name: 'Water', formula: 'H2O' },
    { name: 'Carbon Dioxide', formula: 'CO2' },
    { name: 'Salt', formula: 'NaCl' },
    { name: 'Methane', formula: 'CH4' },
    { name: 'Ammonia', formula: 'NH3' },
];

export const PHYSICS_FORMULAS: PhysicsFormula[] = [
    { question: "Ohm's Law", formulaParts: ["V = ", "R"], missing: "I", options: ["I", "P", "F", "m"] },
    { question: "Force", formulaParts: ["F = ", "a"], missing: "m", options: ["m", "v", "d", "t"] },
];

export const CODE_COMMANDER_LEVELS: CodeCommanderLevel[] = [
    {
        level: 1,
        instructions: "Guide the robot to the target! Use the 'move' command.",
        grid: [
            ['S', 'P', 'P', 'T'],
            ['W', 'W', 'W', 'W'],
        ],
        robotStart: { x: 0, y: 0 },
        target: { x: 3, y: 0 },
        maxCommands: 5,
    },
    {
        level: 2,
        instructions: "Navigate the corner. You'll need to turn!",
        grid: [
            ['S', 'P', 'W'],
            ['W', 'P', 'W'],
            ['W', 'P', 'T'],
        ],
        robotStart: { x: 0, y: 0 },
        target: { x: 2, y: 2 },
        maxCommands: 8,
    }
];

export const ART_PIECES: ArtPiece[] = [
    { title: 'The Starry Night', artist: 'Vincent van Gogh', style: 'Impressionism', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/1280px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg' },
    { title: 'The Persistence of Memory', artist: 'Salvador Dalí', style: 'Surrealism', imageUrl: 'https://upload.wikimedia.org/wikipedia/en/d/dd/The_Persistence_of_Memory.jpg' },
];

export const TRANSLATION_PAIRS: TranslationPair[] = [
    { english: 'Hello', french: 'Bonjour' },
    { english: 'Goodbye', french: 'Au revoir' },
    { english: 'Thank you', french: 'Merci' },
    { english: 'Cat', french: 'Chat' },
];

export const ANATOMY_PARTS: AnatomyPart[] = [
    { name: 'Heart', svg: <svg viewBox="0 0 24 24"><path fill="currentColor" d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z" /></svg> },
    { name: 'Brain', svg: <svg viewBox="0 0 24 24"><path fill="currentColor" d="M12,2A9,9 0 0,0 3,11C3,14.04 4.5,16.88 7,18.68V21.5C7,21.78 7.22,22 7.5,22H9.5C9.78,22 10,21.78 10,21.5V21C10,20.45 10.45,20 11,20H13C13.55,20 14,20.45 14,21V21.5C14,21.78 14.22,22 14.5,22H16.5C16.78,22 17,21.78 17,21.5V18.68C19.5,16.88 21,14.04 21,11A9,9 0 0,0 12,2Z" /></svg> },
];

export const MUSICAL_INSTRUMENTS: MusicalInstrument[] = [
    { name: 'Piano', audioSrc: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_233481492b.mp3' },
    { name: 'Violin', audioSrc: 'https://cdn.pixabay.com/download/audio/2022/02/07/audio_c6b6736566.mp3' },
    { name: 'Guitar', audioSrc: 'https://cdn.pixabay.com/download/audio/2022/08/04/audio_2dde63b059.mp3' },
    { name: 'Flute', audioSrc: 'https://cdn.pixabay.com/download/audio/2021/08/25/audio_51a30a103c.mp3' },
    { name: 'Trumpet', audioSrc: 'https://cdn.pixabay.com/download/audio/2022/01/21/audio_1ab78e306e.mp3' },
];

export const SERVER_TECH_QUESTIONS: ServerTechQuestion[] = [
    { question: 'Which of these is a popular server-side JavaScript runtime?', options: ['React', 'Node.js', 'Angular', 'Vue'], correctAnswer: 'Node.js' },
    { question: 'What does SQL stand for?', options: ['Strong Question Language', 'Structured Query Language', 'Server Query Language', 'Simple Query Language'], correctAnswer: 'Structured Query Language' },
];

export const LITERARY_QUOTES: LiteraryQuote[] = [
    { quote: "It was the best of times, it was the worst of times...", options: ["Moby Dick", "A Tale of Two Cities", "Pride and Prejudice", "1984"], correctBook: "A Tale of Two Cities" },
    { quote: "Call me Ishmael.", options: ["The Great Gatsby", "To Kill a Mockingbird", "Moby Dick", "War and Peace"], correctBook: "Moby Dick" },
];

export const VOCAB_WORDS: VocabVoyageWord[] = [
  { word: "Ephemeral", definition: "Lasting for a very short time." },
  { word: "Ubiquitous", definition: "Present, appearing, or found everywhere." },
  { word: "Mellifluous", definition: "A sound that is sweet and pleasant to hear." },
  { word: "Pulchritudinous", definition: "Having great physical beauty." },
  { word: "Serendipity", definition: "The occurrence of events by chance in a happy or beneficial way." },
];

export const FALLING_WORDS: VocabVoyageWord[] = [...VOCAB_WORDS];

export const HISTORY_EVENTS: HistoryHopEvent[] = [
  { id: 1, text: "The Fall of the Western Roman Empire", year: 476 },
  { id: 2, text: "The Battle of Hastings", year: 1066 },
  { id: 3, text: "The Signing of the Magna Carta", year: 1215 },
];

export const URDU_HARF_GIRAO_LETTERS = "ابپتجچحخدڈذرڑزژسشصضطظعغفقکگلمنںوہیے".split('');
