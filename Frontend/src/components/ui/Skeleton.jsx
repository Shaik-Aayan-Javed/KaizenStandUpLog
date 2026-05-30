import React from 'react';

export function SkeletonMeetingCard() {
  return (
    <div className="grid grid-cols-[68px_1fr] gap-3 animate-pulse">
      <div className="text-right pt-5.5">
        <div className="h-3 w-14 bg-outline-variant/30 rounded ml-auto" />
      </div>
      <div className="relative pl-4 border-l-2 border-outline-variant/20">
        <div className="min-h-[84px] rounded-xl border border-outline-variant/30 bg-surface-container-low/40 px-3.5 py-3 flex items-center gap-3">
          <div className="w-1 h-7 rounded-full bg-outline-variant/30" />
          <div className="space-y-2">
            <div className="h-3 w-40 bg-outline-variant/30 rounded" />
            <div className="h-2.5 w-20 bg-outline-variant/20 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function SkeletonTeamMember() {
  return (
    <div className="flex items-center justify-between px-1.5 py-1.5 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-outline-variant/30" />
        <div className="space-y-1.5">
          <div className="h-3 w-24 bg-outline-variant/30 rounded" />
          <div className="h-2.5 w-14 bg-outline-variant/20 rounded" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonHistoryItem() {
  return (
    <div className="p-4 rounded-lg animate-pulse space-y-2">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-outline-variant/30" />
        <div className="h-3 w-24 bg-outline-variant/30 rounded" />
      </div>
      <div className="h-2.5 w-full bg-outline-variant/20 rounded" />
      <div className="h-2.5 w-3/4 bg-outline-variant/20 rounded" />
    </div>
  );
}
