import React from 'react';

export const ProductSkeleton = () => {
  return (
    <div className="bg-white dark:bg-secondary-900 border border-secondary-200 dark:border-secondary-800 rounded-3xl p-4 space-y-4 animate-pulse">
      {/* Image box */}
      <div className="bg-secondary-200 dark:bg-secondary-800 aspect-square rounded-2xl w-full" />
      {/* Category */}
      <div className="h-4 bg-secondary-200 dark:bg-secondary-800 rounded-full w-1/4" />
      {/* Title */}
      <div className="h-5 bg-secondary-200 dark:bg-secondary-800 rounded-full w-3/4" />
      {/* Description */}
      <div className="space-y-2">
        <div className="h-3.5 bg-secondary-200 dark:bg-secondary-800 rounded-full w-full" />
        <div className="h-3.5 bg-secondary-200 dark:bg-secondary-800 rounded-full w-5/6" />
      </div>
      {/* Price & Rating */}
      <div className="flex justify-between items-center pt-2">
        <div className="h-6 bg-secondary-200 dark:bg-secondary-800 rounded-full w-1/4" />
        <div className="h-4 bg-secondary-200 dark:bg-secondary-800 rounded-full w-1/5" />
      </div>
      {/* Buttons */}
      <div className="flex gap-2 pt-2">
        <div className="h-10 bg-secondary-200 dark:bg-secondary-800 rounded-full flex-1" />
        <div className="h-10 bg-secondary-200 dark:bg-secondary-800 rounded-full w-12" />
      </div>
    </div>
  );
};

export const CategorySkeleton = () => {
  return (
    <div className="bg-white dark:bg-secondary-900 border border-secondary-200 dark:border-secondary-800 rounded-3xl p-4 flex flex-col items-center space-y-3 animate-pulse">
      <div className="w-16 h-16 bg-secondary-200 dark:bg-secondary-800 rounded-full" />
      <div className="h-4 bg-secondary-200 dark:bg-secondary-800 rounded-full w-1/2" />
    </div>
  );
};

export const OrderSkeleton = () => {
  return (
    <div className="bg-white dark:bg-secondary-900 border border-secondary-200 dark:border-secondary-800 rounded-2xl p-6 space-y-4 animate-pulse">
      <div className="flex justify-between items-center border-b border-secondary-100 dark:border-secondary-800 pb-4">
        <div className="space-y-2 w-1/3">
          <div className="h-4 bg-secondary-200 dark:bg-secondary-800 rounded-full w-full" />
          <div className="h-3.5 bg-secondary-200 dark:bg-secondary-800 rounded-full w-2/3" />
        </div>
        <div className="h-6 bg-secondary-200 dark:bg-secondary-800 rounded-full w-1/6" />
      </div>
      <div className="flex justify-between items-center">
        <div className="h-5 bg-secondary-200 dark:bg-secondary-800 rounded-full w-1/4" />
        <div className="h-10 bg-secondary-200 dark:bg-secondary-800 rounded-full w-24" />
      </div>
    </div>
  );
};
