import React from 'react';

export const Footer = () => {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-4 px-4 text-center text-xs text-slate-500 dark:text-slate-400">
      <p className="font-medium">
        Demo project. Data marked <span className="underline decoration-slate-400">"Sample data"</span> is fictional.
      </p>
      <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
        Vishnu Institute of Technology (VIT), Bhimavaram • Campus Placement Tracker
      </p>
    </footer>
  );
};
