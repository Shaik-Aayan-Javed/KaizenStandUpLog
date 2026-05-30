import { useState, useMemo } from 'react';

function formatLocalDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getWeekStart(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = (day + 6) % 7; // Monday as first day of week
  d.setDate(d.getDate() - diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function getWeekDays(date) {
  const start = getWeekStart(date);
  return [...Array(7)].map((_, index) => {
    const current = new Date(start);
    current.setDate(start.getDate() + index);
    return {
      label: ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][current.getDay()],
      labelFull: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][current.getDay()],
      date: current.getDate(),
      monthName: current.toLocaleString('default', { month: 'long' }),
      isoDate: formatLocalDate(current),
      dim: false,
    };
  });
}

export function useCalendar() {
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), today.getDate());
  });

  const calendarDays = useMemo(() => getWeekDays(selectedDate), [selectedDate]);

  const handleDaySelect = (day) => setSelectedDate(day);

  const handleNextDay = () => {
    setSelectedDate((prev) => {
      const next = new Date(prev);
      next.setDate(prev.getDate() + 1);
      return next;
    });
  };

  const handlePrevDay = () => {
    setSelectedDate((prev) => {
      const previous = new Date(prev);
      previous.setDate(prev.getDate() - 1);
      return previous;
    });
  };

  const goToToday = () => {
    const today = new Date();
    setSelectedDate(new Date(today.getFullYear(), today.getMonth(), today.getDate()));
  };

  return { selectedDate, setSelectedDate, calendarDays, handleDaySelect, handleNextDay, handlePrevDay, goToToday };
}
