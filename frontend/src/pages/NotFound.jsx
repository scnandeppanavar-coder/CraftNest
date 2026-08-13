import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowRight } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-8 bg-white dark:bg-secondary-900 border border-secondary-200/60 dark:border-secondary-800 rounded-3xl transition-colors shadow-sm max-w-xl mx-auto my-12 animate-fade-in-up">
      <div className="w-20 h-20 rounded-full bg-primary-50 dark:bg-primary-950/40 text-primary-500 flex items-center justify-center mb-6">
        <Compass className="w-10 h-10 animate-spin" style={{ animationDuration: '6s' }} />
      </div>
      
      <h1 className="font-outfit font-black text-6xl text-secondary-900 dark:text-white tracking-tight">
        404
      </h1>
      
      <h2 className="font-outfit font-extrabold text-xl text-secondary-900 dark:text-white tracking-tight mt-2">
        Page Not Found
      </h2>
      
      <p className="mt-3 text-sm text-secondary-400 dark:text-secondary-500 max-w-xs leading-relaxed">
        The page you are looking for doesn't exist, was renamed, or has been moved. Let's redirect you back.
      </p>
      
      <Link
        to="/"
        className="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 active:scale-95 text-white font-bold text-sm rounded-full shadow-lg shadow-primary-500/10 hover:shadow-primary-600/20 transition-all cursor-pointer"
      >
        Go Back Home <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
};

export default NotFound;
