
import React from 'react';
import { Quiz, QuizQuestion, LeaderboardUser, Achievement, Theme, PaperStyle, PuzzleInfo, Note, Badge } from './types';

// Helper to create gradient defs
const GradientDefs = () => (
  <defs>
    <linearGradient id="grad-gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#FDB931" />
      <stop offset="50%" stopColor="#FFFFAC" />
      <stop offset="100%" stopColor="#D1B464" />
    </linearGradient>
    <linearGradient id="grad-silver" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#E0E0E0" />
      <stop offset="50%" stopColor="#FFFFFF" />
      <stop offset="100%" stopColor="#A0A0A0" />
    </linearGradient>
    <linearGradient id="grad-bronze" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#CD7F32" />
      <stop offset="50%" stopColor="#e8ac74" />
      <stop offset="100%" stopColor="#8a5622" />
    </linearGradient>
    <linearGradient id="grad-diamond" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#b9f2ff" />
      <stop offset="50%" stopColor="#ffffff" />
      <stop offset="100%" stopColor="#00d4ff" />
    </linearGradient>
    <linearGradient id="grad-fire" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor="#ffca28" />
      <stop offset="50%" stopColor="#ff6f00" />
      <stop offset="100%" stopColor="#d50000" />
    </linearGradient>
  </defs>
);

export const ICONS = {
  // Navigation & UI
  home: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>,
  notes: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.75V16.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 16.5V3.75m9 0a2.25 2.25 0 0 0-2.25-2.25H9A2.25 2.25 0 0 0 6.75 3.75m9 0a2.25 2.25 0 0 1 2.25 2.25v10.5A2.25 2.25 0 0 1 15.75 19.5H8.25A2.25 2.25 0 0 1 6 17.25V6.375a2.25 2.25 0 0 1 2.25-2.25m4.5 0h-3.375" /></svg>,
  plusCircle: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>,
  quiz: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" /></svg>,
  progress: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" /></svg>,
  leaderboard: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125-1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125-1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" /></svg>,
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
  flask: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M10.211 4.21c.264-.17.553-.27.854-.27s.59.1.854.27l4.437 2.822a1.125 1.125 0 0 1 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" /></svg>,
  bookOpen: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18c-2.305 0-4.408.867-6 2.292m0-14.25v14.25" /></svg>,
  palette: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" /></svg>,
  atom: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5" /></svg>,
  language: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 0 1 6-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C13.18 7.363 13 8.182 13 9c0 1.773.82 3.34 2.067 4.333m-4.25 2.5a2.25 2.25 0 01-2.25-2.25V3.75m0 5.25a2.25 2.25 0 00-2.25-2.25H3.75" /></svg>,
  musicalNote: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V7.5A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.75" /></svg>,
  draw: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" /></svg>,
  highlight: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M5.25 12h.008v.008H5.25V12Zm3.75 0h.008v.008H9V12Zm3.75 0h.008v.008h-.008V12Z" /></svg>,
  list: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15.004h7.5m-7.5-3h7.5m-7.5-3h7.5M3 12l3 3-3 3" /></svg>,
  dotsVertical: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" /></svg>,
  classroom: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m-7.286 2.72a3 3 0 0 1-4.682-2.72 9.094 9.094 0 0 1 3.741-.479m7.286 2.72a3 3 0 0 0-7.286 0M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-4.5 4.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm13.5 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-4.5-4.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" /></svg>,
  studyPlanner: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0h18M12 12.75h.008v.008H12v-.008Zm0 4.5h.008v.008H12v-.008Zm4.5-4.5h.008v.008h-.008v-.008Zm-8.25 0h.008v.008h-.008V12.75Z" /></svg>,
  friends: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.53-2.473M15 19.128v-3.873m0 3.873a3.375 3.375 0 0 1-3.375-3.375M9 21.75a8.966 8.966 0 0 1-.53-1.785m.53 1.785a3.375 3.375 0 0 1-3.375-3.375m0 0c0-1.864 1.51-3.375 3.375-3.375s3.375 1.511 3.375 3.375m-6.75 0a3.375 3.375 0 0 1 3.375-3.375m-3.375 3.375a3.375 3.375 0 0 1-3.375-3.375m6.75 0v-3.375c0-1.864-1.51-3.375-3.375-3.375S3.75 9.136 3.75 11.25v3.375m6.75 0Zm-3.375 0c-1.864 0-3.375 1.511-3.375 3.375M15 12a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Z" /></svg>,
  cube: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" /></svg>,
  calculator: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V13.5Zm0 2.25h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V18Zm2.498-6.75h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007V18Zm2.504-6.75h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V13.5Zm0 2.25h.008v.008h-.008V18Zm2.498-6.75h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V13.5ZM8.25 6h7.5v2.25h-7.5V6ZM21 12a9 9 0 11-18 0 9 9 0 0118 0Z" /></svg>,
  pie: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z" /></svg>,
  ruler: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.75V16.5m-9-12.75V16.5m0 0L4.5 21m0-4.5L7.5 12m0 4.5L10.5 21m0-4.5L13.5 12m0 4.5L16.5 21m0-4.5L19.5 12m-9 0h9" /></svg>,
  paperclip: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.122 2.122l7.81-7.81" /></svg>,
  presentationChart: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z" /></svg>,
  library: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18c-2.305 0-4.408.867-6 2.292m0-14.25v14.25" /></svg>,
  brackets: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" /></svg>,
  flame: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.362-3.797A8.33 8.33 0 0 1 12 6c1.23 0 2.398.404 3.362 1.098Z" /></svg>,
  calendar: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0h18" /></svg>,
  
  // EPIC ICONS FOR BADGES
  crown: (
    <>
      <GradientDefs />
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="url(#grad-gold)" stroke="currentColor" strokeWidth={0.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
      </svg>
    </>
  ),
  diamond: (
    <>
      <GradientDefs />
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="url(#grad-diamond)" stroke="currentColor" strokeWidth={0.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5h16.5" opacity="0.3" />
      </svg>
    </>
  ),
  trophy: (
    <>
      <GradientDefs />
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="url(#grad-gold)" stroke="currentColor" strokeWidth={0.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.504-1.125-1.125-1.125h-8.71c-.621 0-1.125.504-1.125 1.125v3.375m16.5-9.375a6 6 0 0 0-6-6h-6a6 6 0 0 0-6 6v1.875a6 6 0 0 0 6 6h6a6 6 0 0 0 6-6v-1.875Z" />
      </svg>
    </>
  ),
  flame_epic: (
    <>
      <GradientDefs />
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="url(#grad-fire)" stroke="currentColor" strokeWidth={0.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.362-3.797A8.33 8.33 0 0 1 12 6c1.23 0 2.398.404 3.362 1.098Z" />
      </svg>
    </>
  ),
  star_epic: (
    <>
      <GradientDefs />
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="url(#grad-silver)" stroke="currentColor" strokeWidth={0.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
      </svg>
    </>
  ),
  book_epic: (
    <>
      <GradientDefs />
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="url(#grad-bronze)" stroke="currentColor" strokeWidth={0.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18c-2.305 0-4.408.867-6 2.292m0-14.25v14.25" />
      </svg>
    </>
  ),
  target_epic: (
    <>
      <GradientDefs />
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="url(#grad-silver)" stroke="currentColor" strokeWidth={0.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-3.36V4.842a14.982 14.982 0 0 0-6.16 3.36m0 0a14.982 14.982 0 0 1-6.16-3.36V4.842a14.982 14.982 0 0 1 6.16 3.36m0 0a14.982 14.982 0 0 0-6.16 3.36v6.252a14.982 14.982 0 0 0 6.16-3.36M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18Z" />
      </svg>
    </>
  ),
  snake: (
    <>
      <GradientDefs />
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="url(#grad-bronze)" stroke="currentColor" strokeWidth={0.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l6-6m0 0l6 6m-6-6v12a6 6 0 01-12 0v-3" />
      </svg>
    </>
  ),
  tower: (
    <>
      <GradientDefs />
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="url(#grad-silver)" stroke="currentColor" strokeWidth={0.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M6 3v18m12-18v18m-9-4.5h6.75a1.5 1.5 0 0 0 1.5-1.5v-1.5a1.5 1.5 0 0 0-1.5-1.5H9a1.5 1.5 0 0 0-1.5 1.5v1.5a1.5 1.5 0 0 0 1.5 1.5Z" />
      </svg>
    </>
  ),
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

export const PAKISTANI_BOARDS = [
    "Federal Board (FBISE)",
    "Punjab Textbook Board",
    "Sindh Textbook Board",
    "KPK Textbook Board",
    "Balochistan Textbook Board",
    "AJK Textbook Board",
    "Cambridge (O/A Levels)",
    "Aga Khan University Examination Board"
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

export const LANGUAGES = [
    { name: "Urdu", code: "ur" },
    { name: "English", code: "en" },
    { name: "Spanish", code: "es" },
    { name: "French", code: "fr" },
    { name: "German", code: "de" },
    { name: "Mandarin Chinese", code: "zh" },
    { name: "Hindi", code: "hi" },
    { name: "Arabic", code: "ar" },
    { name: "Portuguese", code: "pt" },
    { name: "Bengali", code: "bn" },
    { name: "Russian", code: "ru" },
    { name: "Japanese", code: "ja" },
    { name: "Punjabi", code: "pa" },
    { name: "Javanese", code: "jv" },
    { name: "Korean", code: "ko" },
    { name: "Vietnamese", code: "vi" },
    { name: "Telugu", code: "te" },
    { name: "Marathi", code: "mr" },
    { name: "Turkish", code: "tr" },
    { name: "Tamil", code: "ta" },
    { name: "Italian", code: "it" },
    { name: "Thai", code: "th" },
    { name: "Gujarati", code: "gu" },
    { name: "Polish", code: "pl" },
    { name: "Ukrainian", code: "uk" },
    { name: "Malayalam", code: "ml" },
    { name: "Kannada", code: "kn" },
    { name: "Oriya", code: "or" },
    { name: "Burmese", code: "my" },
    { name: "Pashto", code: "ps" },
    { name: "Uzbek", code: "uz" },
    { name: "Sindhi", code: "sd" },
    { name: "Amharic", code: "am" },
    { name: "Fula", code: "ff" },
    { name: "Romanian", code: "ro" },
    { name: "Dutch", code: "nl" },
    { name: "Azerbaijani", code: "az" },
    { name: "Nepali", code: "ne" },
    { name: "Hungarian", code: "hu" },
    { name: "Greek", code: "el" },
    { name: "Czech", code: "cs" },
    { name: "Swedish", code: "sv" },
    { name: "Hebrew", code: "he" },
    { name: "Finnish", code: "fi" },
    { name: "Danish", code: "da" },
    { name: "Norwegian", code: "no" },
    { name: "Slovak", code: "sk" },
    { name: "Swahili", code: "sw" },
    { name: "Indonesian", code: "id" },
    { name: "Filipino", code: "fil" },
];

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

export const XP_PER_LEVEL = 1000;

export const THEMES: Theme[] = [
    { name: 'Nebula', className: 'theme-nebula', colors: { '--hue-primary': '257', '--hue-secondary': '283' }, cost: 0 },
    { name: 'Forest', className: 'theme-forest', colors: { '--hue-primary': '150', '--hue-secondary': '130' }, cost: 0 },
    { name: 'Sunset', className: 'theme-sunset', colors: { '--hue-primary': '25', '--hue-secondary': '350' }, cost: 0 },
    { name: 'Ocean', className: 'theme-ocean', colors: { '--hue-primary': '200', '--hue-secondary': '180' }, cost: 0 },
    { name: 'Crimson', className: 'theme-crimson', colors: { '--hue-primary': '0', '--hue-secondary': '340' }, cost: 0 },
    { name: 'Mint', className: 'theme-mint', colors: { '--hue-primary': '160', '--hue-secondary': '175' }, cost: 0 },
    { name: 'Amethyst', className: 'theme-amethyst', colors: { '--hue-primary': '270', '--hue-secondary': '250' }, cost: 0 },
    { name: 'Gold', className: 'theme-gold', colors: { '--hue-primary': '45', '--hue-secondary': '35' }, cost: 0 },
    { name: 'Cyber', className: 'theme-cyber', colors: { '--hue-primary': '180', '--hue-secondary': '280' }, cost: 0 },
    { name: 'Sakura', className: 'theme-sakura', colors: { '--hue-primary': '340', '--hue-secondary': '320' }, cost: 0 },
    { name: 'Matrix', className: 'theme-matrix', colors: { '--hue-primary': '140', '--hue-secondary': '150' }, cost: 0 },
    { name: 'Sunrise', className: 'theme-sunrise', colors: { '--hue-primary': '40', '--hue-secondary': '15' }, cost: 0 },
];

export const PAPER_STYLES: PaperStyle[] = [
    { name: 'Default', className: 'paper-default', preview: 'bg-white' },
    { name: 'Lined', className: 'paper-lined', preview: 'paper-lined' },
    { name: 'Grid', className: 'paper-grid', preview: 'paper-grid' },
    { name: 'Dotted', className: 'paper-dotted', preview: 'paper-dotted' },
    { name: 'Vintage', className: 'paper-vintage', preview: 'paper-vintage' },
    { name: 'Blueprint', className: 'paper-blueprint', preview: 'paper-blueprint' },
    { name: 'Blackboard', className: 'paper-blackboard', preview: 'paper-blackboard' },
];

export const ACHIEVEMENTS: Achievement[] = [
    // Streak & Login
    { id: 'streak-starter', name: 'Momentum', description: 'Start a 2-day streak', icon: ICONS.flame_epic, unlocked: false },
    { id: 'streak-week', name: 'On Fire', description: 'Reach a 7-day streak', icon: ICONS.flame_epic, unlocked: false },
    { id: 'streak-month', name: 'Unstoppable', description: 'Reach a 30-day streak', icon: ICONS.flame_epic, unlocked: false },
    { id: 'first-login', name: 'Hello World', description: 'Log in for the first time', icon: ICONS.home, unlocked: false },
    { id: 'early-bird', name: 'Early Bird', description: 'Log in before 8 AM', icon: ICONS.sun, unlocked: false },
    { id: 'night-owl', name: 'Night Owl', description: 'Log in after 10 PM', icon: ICONS.moon, unlocked: false },
    
    // Quiz & Learning
    { id: 'first-quiz', name: 'First Step', description: 'Complete your first quiz', icon: ICONS.flag, unlocked: false },
    { id: 'perfect-score', name: 'Perfectionist', description: 'Get 100% on a quiz', icon: ICONS.star_epic, unlocked: false },
    { id: 'subject-pro', name: 'Subject Pro', description: 'Get 100% on 3 quizzes in one subject', icon: ICONS.brain, unlocked: false },
    { id: 'quiz-master-10', name: 'Quiz Master I', description: 'Complete 10 quizzes', icon: ICONS.trophy, unlocked: false },
    { id: 'quiz-master-50', name: 'Quiz Master II', description: 'Complete 50 quizzes', icon: ICONS.crown, unlocked: false },
    { id: 'fast-learner', name: 'Fast Learner', description: 'Finish a quiz in under 60 seconds', icon: ICONS.timer, unlocked: false },
    { id: 'persistent', name: 'Persistent', description: 'Retry a quiz you failed', icon: ICONS.target_epic, unlocked: false },
    
    // Creation
    { id: 'creator', name: 'Creator', description: 'Create your own quiz', icon: ICONS.plusCircle, unlocked: false },
    { id: 'game-creator', name: 'Game Dev', description: 'Create a custom game', icon: ICONS.cube, unlocked: false },
    { id: 'note-taker', name: 'Scribe', description: 'Create a note', icon: ICONS.notes, unlocked: false },
    { id: 'prolific-writer', name: 'Prolific Writer', description: 'Create 10 notes', icon: ICONS.book_epic, unlocked: false },
    
    // Math Arcade
    { id: 'prime-patrol-pro', name: 'Prime Hunter', description: 'Score 100 in Prime Patrol', icon: ICONS.star_epic, unlocked: false },
    { id: 'fraction-master', name: 'Fraction Master', description: 'Score 100 in Fraction Games', icon: ICONS.pie, unlocked: false },
    { id: 'decimal-dynamo', name: 'Decimal Dynamo', description: 'Score 150 in Decimal Dash', icon: ICONS.ruler, unlocked: false },
    { id: 'equation-expert', name: 'Equation Expert', description: 'Score 200 in Equation Explorer', icon: ICONS.flask, unlocked: false },
    { id: 'sequence-sensei', name: 'Sequence Sensei', description: 'Score 100 in Sequence Solver', icon: ICONS.list, unlocked: false },
    { id: 'shape-shifter', name: 'Geometry Genius', description: 'Score 100 in Geo Guesser', icon: ICONS.cube, unlocked: false },
    { id: 'snake-charmer', name: 'Snake Charmer', description: 'Score 50 in Neon Number Snake', icon: ICONS.snake, unlocked: false },
    { id: 'tower-defender', name: 'Tower Defender', description: 'Survive 5 waves in Cyber Tower Defense', icon: ICONS.tower, unlocked: false },
    
    // Exploration
    { id: 'puzzle-starter', name: 'Puzzle Fan', description: 'Play a game in the arcade', icon: ICONS.puzzle, unlocked: false },
    { id: 'explorer', name: 'Explorer', description: 'Visit every page in the app', icon: ICONS.search, unlocked: false },
    { id: 'theme-changer', name: 'Chameleon', description: 'Change the app theme', icon: ICONS.palette, unlocked: false },
    { id: 'bookworm', name: 'Bookworm', description: 'Open a book in BookWise', icon: ICONS.bookOpen, unlocked: false },
    { id: 'social-butterfly', name: 'Social Butterfly', description: 'Share a quiz or note', icon: ICONS.friends, unlocked: false },
    
    // Miscellaneous
    { id: 'comeback-king', name: 'Comeback', description: 'Return after a week of absence', icon: ICONS.diamond, unlocked: false },
    { id: 'weekend-warrior', name: 'Weekend Warrior', description: 'Study on a Saturday or Sunday', icon: ICONS.calendar, unlocked: false },
    { id: 'focus-novice', name: 'Focus Novice', description: 'Use the timer for 25 minutes', icon: ICONS.timer, unlocked: false },
    
    // Filler to reach 50+
    { id: 'level-5', name: 'Level Up', description: 'Reach Level 5', icon: ICONS.xp, unlocked: false },
    { id: 'level-10', name: 'Rising Star', description: 'Reach Level 10', icon: ICONS.xp, unlocked: false },
    { id: 'level-20', name: 'Veteran', description: 'Reach Level 20', icon: ICONS.xp, unlocked: false },
    { id: 'level-50', name: 'Legend', description: 'Reach Level 50', icon: ICONS.xp, unlocked: false },
    { id: 'math-lover', name: 'Math Lover', description: 'Complete 5 math-related activities', icon: ICONS.calculator, unlocked: false },
];

export const PUZZLES: PuzzleInfo[] = [
    { title: 'Prime Patrol', description: 'Find prime numbers in the grid before time runs out.', subject: 'Maths', path: '/prime-patrol', icon: ICONS.target, cost: 0 },
    { title: 'Geo Guesser', description: 'Identify the 3D shapes correctly.', subject: 'Maths', path: '/geo-guesser', icon: ICONS.cube, cost: 0 },
    { title: 'Neon Snake', description: 'Solve math problems to grow your snake.', subject: 'Maths', path: '/neon-snake', icon: ICONS.snake, cost: 0 },
    { title: 'Tower Defense', description: 'Protect the base by solving equations.', subject: 'Maths', path: '/tower-defense', icon: ICONS.tower, cost: 0 },
    { title: 'Equation Explorer', description: 'Find the value of x.', subject: 'Maths', path: '/equation-explorer', icon: ICONS.flask, cost: 0 },
    { title: 'Decimal Dash', description: 'Place decimals on the number line.', subject: 'Maths', path: '/decimal-dash', icon: ICONS.ruler, cost: 0 },
    { title: 'Sequence Solver', description: 'Find the next number in the sequence.', subject: 'Maths', path: '/sequence-solver', icon: ICONS.list, cost: 0 },
    { title: 'Fraction Attraction', description: 'Solve fraction operations.', subject: 'Maths', path: '/fraction-attraction', icon: ICONS.pie, cost: 0 },
    // Removed Fraction Flipper if no page exists for it, or add page. Based on provided file list, FractionAttractionPage exists. 
    // Assuming Fraction Flipper was intended to be FractionAttraction or similar. 
    // But FractionFlipperPage DOES exist in the file list provided in prompt "--- START OF FILE pages/FractionFlipperPage.tsx ---".
    { title: 'Fraction Flipper', description: 'Match visual fractions.', subject: 'Maths', path: '/fraction-flipper', icon: ICONS.pie, cost: 0 },
];

export const LANGUAGE_PUZZLES: PuzzleInfo[] = [
    { title: 'Lafz Jodo', description: 'Connect letters to form words.', subject: 'Urdu', path: '/lafz-jodo', icon: ICONS.language, cost: 0 },
    { title: 'Jumla Sazi', description: 'Construct sentences with given words.', subject: 'Urdu', path: '/jumla-sazi', icon: ICONS.draw, cost: 0 },
    { title: 'Harf Girao', description: 'Type falling letters quickly.', subject: 'Urdu', path: '/harf-girao', icon: ICONS.arrowRight, cost: 0 }, 
    { title: 'Muhavra Pehchano', description: 'Identify the meaning of idioms.', subject: 'Urdu', path: '/muhavra-pehchano', icon: ICONS.lightbulb, cost: 0 },
    { title: 'Wahid Jama', description: 'Match singulars with plurals.', subject: 'Urdu', path: '/wahid-jama', icon: ICONS.friends, cost: 0 },
    { title: 'Tashreeh Master', description: 'Explain the proverbs.', subject: 'Urdu', path: '/tashreeh-master', icon: ICONS.bookOpen, cost: 0 },
];

export const BADGES: Badge[] = [
    { id: 'math-whiz', name: 'Math Whiz', description: 'Score 1000 in Math Blaster', icon: ICONS.calculator, xpReward: 500, rarity: 'Rare' },
    { id: 'bookworm', name: 'Bookworm', description: 'Read a chapter in Book Wise', icon: ICONS.bookOpen, xpReward: 200, rarity: 'Common' },
    { id: 'puzzle-starter', name: 'Puzzle Fan', description: 'Play your first puzzle', icon: ICONS.puzzle, xpReward: 100, rarity: 'Common' },
    { id: 'snake-charmer', name: 'Snake Charmer', description: 'Score 50 in Neon Snake', icon: ICONS.snake, xpReward: 300, rarity: 'Epic' },
    { id: 'tower-defender', name: 'Tower Defender', description: 'Survive 5 waves', icon: ICONS.tower, xpReward: 400, rarity: 'Epic' },
    { id: 'prime-patrol-pro', name: 'Prime Hunter', description: 'Score 100 in Prime Patrol', icon: ICONS.star, xpReward: 300, rarity: 'Rare' },
    { id: 'fraction-master', name: 'Fraction Master', description: 'Score 100 in Fraction games', icon: ICONS.pie, xpReward: 300, rarity: 'Rare' },
    { id: 'decimal-dynamo', name: 'Decimal Dynamo', description: 'Score 150 in Decimal Dash', icon: ICONS.ruler, xpReward: 300, rarity: 'Rare' },
    { id: 'equation-expert', name: 'Equation Expert', description: 'Score 200 in Equation Explorer', icon: ICONS.flask, xpReward: 400, rarity: 'Epic' },
    { id: 'sequence-sensei', name: 'Sequence Sensei', description: 'Score 100 in Sequence Solver', icon: ICONS.list, xpReward: 300, rarity: 'Rare' },
    { id: 'shape-shifter', name: 'Geometry Genius', description: 'Score 100 in Geo Guesser', icon: ICONS.cube, xpReward: 300, rarity: 'Rare' },
];

export const OFFICIAL_BOOK_DATABASE: Record<string, Record<string, string[]>> = {
    '9th Grade': {
        'Biology': ['Introduction to Biology', 'Solving a Biological Problem', 'Biodiversity', 'Cells and Tissues', 'Cell Cycle', 'Enzymes', 'Bioenergetics', 'Nutrition', 'Transport'],
        'Chemistry': ['Fundamentals of Chemistry', 'Structure of Atoms', 'Periodic Table', 'Structure of Molecules', 'Physical States of Matter', 'Solutions', 'Electrochemistry', 'Chemical Reactivity'],
        'Physics': ['Physical Quantities', 'Kinematics', 'Dynamics', 'Turning Effect of Forces', 'Gravitation', 'Work and Energy', 'Properties of Matter', 'Thermal Properties', 'Transfer of Heat'],
        'Computer Science': ['Problem Solving', 'Binary System', 'Networks', 'Data and Privacy', 'Designing Website'],
        'Maths': ['Matrices', 'Real Numbers', 'Logarithms', 'Algebraic Expressions', 'Factorization', 'Algebraic Manipulation', 'Linear Equations', 'Linear Graphs', 'Intro to Geometry']
    },
    '10th Grade': {
        'Biology': ['Gaseous Exchange', 'Homeostasis', 'Coordination and Control', 'Support and Movement', 'Reproduction', 'Inheritance', 'Man and Environment', 'Biotechnology', 'Pharmacology'],
        'Chemistry': ['Chemical Equilibrium', 'Acids, Bases and Salts', 'Organic Chemistry', 'Hydrocarbons', 'Biochemistry', 'The Atmosphere', 'Water', 'Chemical Industries'],
        'Physics': ['Simple Harmonic Motion', 'Sound', 'Geometrical Optics', 'Electrostatics', 'Current Electricity', 'Electromagnetism', 'Basic Electronics', 'ICT', 'Atomic Physics'],
        'Computer Science': ['Programming', 'User Interface', 'Conditional Logic', 'Data Structures', 'Functions'],
        'Maths': ['Quadratic Equations', 'Theory of Quadratic Equations', 'Variations', 'Partial Fractions', 'Sets and Functions', 'Basic Statistics', 'Introduction to Trigonometry']
    }
};

export const URDU_HARF_GIRAO_LETTERS = ['ا', 'ب', 'پ', 'ت', 'ٹ', 'ث', 'ج', 'چ', 'ح', 'خ', 'د', 'ڈ', 'ذ', 'ر', 'ڑ', 'ز', 'ژ', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ک', 'گ', 'ل', 'م', 'ن', 'و', 'ہ', 'ی', 'ے'];

export const MOCK_USERS = {
    'user1': { name: 'Ali Khan', avatar: 'https://api.dicebear.com/8.x/avataaars/svg?seed=Ali' },
    'user2': { name: 'Sara Ahmed', avatar: 'https://api.dicebear.com/8.x/avataaars/svg?seed=Sara' },
    'user3': { name: 'Omar B.', avatar: 'https://api.dicebear.com/8.x/avataaars/svg?seed=Omar' },
};

export const MOCK_COMMUNITY_QUIZZES: Quiz[] = [
    {
        id: 'comm-1',
        title: 'Solar System Trivia',
        subject: 'Science',
        author: 'Ali Khan',
        authorId: 'user1',
        questions: [],
        isPublic: true,
        rating: 4.5,
        ratingCount: 12,
        grade: '6th Grade'
    },
    {
        id: 'comm-2',
        title: 'Basic Algebra',
        subject: 'Maths',
        author: 'Sara Ahmed',
        authorId: 'user2',
        questions: [],
        isPublic: true,
        rating: 4.8,
        ratingCount: 25,
        grade: '8th Grade'
    }
];

export const MOCK_COMMUNITY_NOTES: Note[] = [
    {
        id: 'note-1',
        title: 'Photosynthesis Summary',
        content: '<p>Photosynthesis is the process by which plants use sunlight...</p>',
        subject: 'Science',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        authorId: 'user2',
        isPublic: true
    }
];
