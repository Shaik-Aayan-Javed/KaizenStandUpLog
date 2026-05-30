import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function CalendarStrip({ calendarDays, selectedDate, onDaySelect, onPrevDay, onNextDay, onToday }) {
  const selectedIso = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;

  const parseLocalDate = (isoDate) => {
    const [year, month, day] = isoDate.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  const weekRangeText = `${calendarDays[0]?.monthName} ${calendarDays[0]?.date} – ${calendarDays[6]?.date}, ${new Date(calendarDays[0]?.isoDate).getFullYear()}`;

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-[clamp(1.2rem,1.8vw,1.45rem)] leading-tight font-bold text-primary tracking-tight">
            Weekly Planner &amp; Schedule
          </h2>
          <p className="text-[clamp(0.68rem,1.1vw,0.8rem)] tracking-wide text-on-surface-variant mt-1">{weekRangeText}</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onToday}
            className="h-8 px-3.5 rounded-xl border border-outline-variant text-[11px] font-semibold text-on-surface hover:bg-surface-container"
          >
            Today
          </button>
          <div className="h-8 flex rounded-xl border border-outline-variant overflow-hidden">
            <button onClick={onPrevDay} className="w-8 grid place-items-center hover:bg-surface-container">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={onNextDay} className="w-8 grid place-items-center border-l border-outline-variant hover:bg-surface-container">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 border-b border-outline-variant/70 pb-5">
        {calendarDays.map((day) => {
          const isActive = selectedIso === day.isoDate;
          return (
            <button
              key={day.isoDate}
              onClick={() => onDaySelect(parseLocalDate(day.isoDate))}
              className={`h-[78px] sm:h-[86px] rounded-xl flex flex-col items-center justify-center transition-all premium-hover-surface ${
                isActive
                  ? 'bg-primary text-on-primary shadow-[0_8px_22px_rgba(60,95,128,0.22)]'
                  : 'hover:bg-surface-container-low text-on-surface'
              } ${day.dim && !isActive ? 'opacity-45' : ''}`}
            >
              <span className={`text-[8px] ${isActive ? 'text-on-primary/85' : 'text-on-surface-variant'}`}>{day.label}</span>
              <span className="text-[20px] leading-none font-bold mt-1">{day.date}</span>
              {isActive && <span className="w-1.5 h-1.5 rounded-full bg-white mt-1.5" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
