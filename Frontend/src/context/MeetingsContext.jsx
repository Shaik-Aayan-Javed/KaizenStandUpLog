import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchMeetings, createMeeting, updateMeeting, deleteMeeting } from '../api/meetings';
import { useAuth } from './AuthContext';

const MeetingsContext = createContext(null);

const sprintTagStyles = {
  '#analysis': { borderClass: 'border-secondary', leftBarBg: 'bg-secondary', tagColor: 'bg-secondary-container text-on-secondary-container' },
  '#design': { borderClass: 'border-primary', leftBarBg: 'bg-primary', tagColor: 'bg-primary-fixed text-on-primary-fixed-variant' },
  '#development': { borderClass: 'border-tertiary-container', leftBarBg: 'bg-tertiary-container', tagColor: 'bg-tertiary-fixed text-on-tertiary-fixed-variant' },
  '#testing': { borderClass: 'border-error', leftBarBg: 'bg-error', tagColor: 'bg-error-container text-on-error-container' },
};

const mapId = (arr) => arr.map((item) => ({ ...item, id: item._id }));

export function MeetingsProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [meetings, setMeetings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Refresh all meetings from the server
  const refreshMeetings = async () => {
    const all = await fetchMeetings();
    setMeetings(mapId(all).map((item) => ({ ...item, completed: item.completed ?? false })));
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    refreshMeetings().finally(() => setIsLoading(false));
  }, [isAuthenticated]);

  const handleCreateStandup = async (formData, selectedDate) => {
    const styles = sprintTagStyles[formData.tag] || sprintTagStyles['#analysis'];
    const selectedIso = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;
    const newMeeting = {
      time: formData.time,
      endTime: formData.endTime,
      title: formData.title,
      tag: formData.tag,
      day: selectedDate.getDate(),
      date: selectedIso,
      isActive: formData.isActive,
      isPinned: formData.isPinned,
      completed: false,
      ...styles,
    };
    await createMeeting(newMeeting);
    await refreshMeetings();
  };

  const handleMarkDone = async (meetingId) => {
    const updated = await updateMeeting(meetingId, { completed: true });
    setMeetings((prev) =>
      prev.map((m) => (m.id === (updated._id || updated.id) ? { ...updated, id: updated._id || updated.id } : m))
    );
  };

  const handleDeleteMeeting = async (meetingId) => {
    await deleteMeeting(meetingId);
    setMeetings((prev) => prev.filter((m) => m.id !== meetingId));
  };

  return (
    <MeetingsContext.Provider value={{ meetings, isLoading, handleCreateStandup, handleMarkDone, handleDeleteMeeting }}>
      {children}
    </MeetingsContext.Provider>
  );
}

export const useMeetings = () => {
  const ctx = useContext(MeetingsContext);
  if (!ctx) throw new Error('useMeetings must be used inside MeetingsProvider');
  return ctx;
};
