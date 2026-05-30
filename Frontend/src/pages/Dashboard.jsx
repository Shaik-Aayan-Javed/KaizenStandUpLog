import React, { useMemo } from 'react';
import { AlertCircle, PlusCircle, Calendar } from 'lucide-react';
import { CalendarStrip } from '../components/dashboard/CalendarStrip';
import { MeetingCard } from '../components/dashboard/MeetingCard';
import { SprintPanel } from '../components/dashboard/SprintPanel';
import { SkeletonMeetingCard } from '../components/ui/Skeleton';
import { useMeetings } from '../context/MeetingsContext';
import { useCalendar } from '../hooks/useCalendar';

function Dashboard({ activeTab, setActiveTab, isSidebarOpen, setIsNewStandupOpen }) {
  const { meetings, isLoading, handleMarkDone, handleDeleteMeeting } = useMeetings();
  const { selectedDate, calendarDays, handleDaySelect, handleNextDay, handlePrevDay, goToToday } = useCalendar();

  const filteredMeetings = useMemo(() => {
    const selectedIso = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;
    return meetings.filter((m) => {
      const matchesDay = m.day === selectedDate.getDate();
      const matchesDate = m.date === selectedIso;
      return (matchesDay || matchesDate) && !m.completed;
    });
  }, [meetings, selectedDate]);

  if (activeTab !== 'Dashboard') {
    return (
      <section className={`col-span-12 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <div className="bg-white rounded-2xl border border-outline-variant p-12 text-center flex flex-col items-center justify-center min-h-[500px] m-6">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
            <Calendar className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-primary mb-2">{activeTab} Section</h2>
          <button onClick={() => setActiveTab('Dashboard')} className="mt-6 px-4 py-2 bg-primary text-on-primary rounded-xl text-sm font-bold hover:bg-primary-container">
            Back to Dashboard Workspace
          </button>
        </div>
      </section>
    );
  }

  return (
    <main className={`px-4 sm:px-5 lg:px-6 py-6 sm:py-7 lg:py-8 grid grid-cols-12 gap-4 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
      <section className="col-span-12 xl:col-span-8 space-y-6">
        <CalendarStrip
          calendarDays={calendarDays}
          selectedDate={selectedDate}
          onDaySelect={handleDaySelect}
          onPrevDay={handlePrevDay}
          onNextDay={handleNextDay}
          onToday={goToToday}
        />

        <div className="space-y-3">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => <SkeletonMeetingCard key={i} />)
          ) : filteredMeetings.length === 0 ? (
            <div className="py-16 px-6 border border-dashed border-outline-variant rounded-2xl text-center bg-white">
              <AlertCircle className="w-10 h-10 text-outline-variant mx-auto mb-3" />
              <h4 className="text-base font-bold">No meetings scheduled</h4>
              <button onClick={() => setIsNewStandupOpen(true)} className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg text-sm font-bold">
                <PlusCircle className="w-4 h-4" />
                Schedule a Task
              </button>
            </div>
          ) : (
            filteredMeetings.map((meeting) => (
              <MeetingCard
                key={meeting.id}
                meeting={meeting}
                onMarkDone={handleMarkDone}
                onDelete={handleDeleteMeeting}
              />
            ))
          )}
        </div>

        {filteredMeetings.length > 0 && !isLoading && (
          <div className="mt-4 flex justify-center">
            <button onClick={() => setIsNewStandupOpen(true)} className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg text-sm font-bold">
              <PlusCircle className="w-4 h-4" />
              Schedule a Task
            </button>
          </div>
        )}
      </section>

      <SprintPanel meetings={meetings} />
    </main>
  );
}

export default Dashboard;
