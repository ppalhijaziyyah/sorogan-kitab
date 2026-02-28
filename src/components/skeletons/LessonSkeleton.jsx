import React from 'react';

const SkeletonLine = ({ width, height = 'h-8' }) => (
  <div className={`bg-gray-300 dark:bg-gray-700 rounded-md animate-pulse ${width} ${height}`}></div>
);

const LessonSkeleton = () => {
  return (
    <div className="max-w-5xl mx-auto">
      {/* Skeleton for Header */}
      <div className="mb-6">
        <SkeletonLine width="w-3/4" height="h-10" />
        <div className="mt-2">
          <SkeletonLine width="w-1/2" height="h-6" />
        </div>
      </div>

      {/* Skeleton for Content */}
      <div className="p-6 bg-white/50 dark:bg-gray-800/50 rounded-lg shadow-md">
        <div dir="rtl" className="space-y-5">
          <div className="flex justify-end space-x-2 space-x-reverse">
            <SkeletonLine width="w-20" />
            <SkeletonLine width="w-16" />
            <SkeletonLine width="w-24" />
            <SkeletonLine width="w-12" />
          </div>
          <div className="flex justify-end space-x-2 space-x-reverse">
            <SkeletonLine width="w-16" />
            <SkeletonLine width="w-20" />
            <SkeletonLine width="w-12" />
            <SkeletonLine width="w-24" />
            <SkeletonLine width="w-16" />
          </div>
          <div className="flex justify-end space-x-2 space-x-reverse">
            <SkeletonLine width="w-24" />
            <SkeletonLine width="w-12" />
            <SkeletonLine width="w-20" />
          </div>
        </div>
      </div>

      {/* Skeleton for Actions */}
      <div className="mt-8 flex justify-center space-x-4">
        <SkeletonLine width="w-32" height="h-12" />
        <SkeletonLine width="w-32" height="h-12" />
      </div>
    </div>
  );
};

export default LessonSkeleton;
