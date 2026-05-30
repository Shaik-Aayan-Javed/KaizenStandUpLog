import React, { useState } from 'react';
import { CircleDot, Check, X, Pin } from 'lucide-react';
import { ConfirmDialog } from '../ui/ConfirmDialog';

const sprintCategoryLabels = {
  '#analysis': 'Analysis',
  '#design': 'Design',
  '#development': 'Development',
  '#testing': 'Testing',
  '#engineering': 'Development',
  '#architecture': 'Analysis',
  '#product': 'Design',
  '#management': 'Testing',
};

function getTagLabel(tag) {
  return sprintCategoryLabels[(tag || '').toLowerCase()] || (tag || '').replace('#', '');
}

export function MeetingCard({ meeting, onMarkDone, onDelete }) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <>
      <div className="grid grid-cols-[68px_1fr] gap-3 group">
        <div className="text-right pt-5.5">
          <span className="text-[12px] tracking-wide text-outline">
            {meeting.time}{meeting.endTime ? ' - ' + meeting.endTime : ''}
          </span>
        </div>

        <div className="relative pl-4 border-l-2 border-primary-fixed-dim/70">
          <div className={`premium-card min-h-[84px] rounded-xl border border-outline-variant/70 bg-white px-3.5 py-3 flex items-center justify-between ${meeting.opacityClass || ''}`}>
            <div className="flex items-center gap-3 min-w-0">
              <div className={`w-1 h-7 rounded-full ${meeting.leftBarBg}`} />
              <div>
                <h4 className={`text-[15px] font-semibold leading-none text-on-surface ${meeting.completed ? 'line-through opacity-60' : ''}`}>
                  {meeting.title}
                </h4>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className={`inline-flex px-2 py-0.5 rounded-md text-[10px] ${meeting.tagColor}`}>
                    {getTagLabel(meeting.tag)}
                  </span>
                  {meeting.isPinned && <Pin className="w-3 h-3 text-tertiary" />}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {meeting.isActive && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-primary/20 bg-primary/5">
                  <CircleDot className="w-4 h-4 text-primary" />
                  <span className="text-[10px] text-primary font-bold tracking-wider">ACTIVE</span>
                </div>
              )}

              {meeting.completed && (
                <div className="text-[10px] px-2 py-1 rounded-full bg-secondary/10 text-secondary font-bold">Done</div>
              )}

              {!meeting.completed && (
                <button
                  onClick={() => onMarkDone(meeting.id)}
                  className="opacity-0 group-hover:opacity-100 p-2 rounded-md hover:bg-slate-100 text-success transition"
                  title="Mark as done"
                >
                  <Check className="w-4 h-4" />
                </button>
              )}

              <button
                onClick={() => setConfirmOpen(true)}
                className="opacity-0 group-hover:opacity-100 p-2 rounded-md hover:bg-slate-100 text-outline hover:text-error transition"
                title="Remove meeting"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={confirmOpen}
        title="Remove meeting?"
        message={`"${meeting.title}" will be permanently removed from the schedule.`}
        confirmLabel="Remove"
        onConfirm={() => { onDelete(meeting.id); setConfirmOpen(false); }}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
}
