import React from 'react';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  PlusCircle,
  CircleDot,
  Pin,
  X,
  MoreVertical,
  Flame,
  Check
} from 'lucide-react';

function Dashboard({
  activeTab,
  setActiveTab,
  isSidebarOpen,
  selectedDate,
  setSelectedDate,
  handlePrevDay,
  handleNextDay,
  handleDaySelect,
  calendarDays,
  filteredMeetings,
  meetings,
  setMeetings,
  setIsNewStandupOpen,
  teamMembers,
  activeTeamMemberId,
  setActiveTeamMemberId,
  toggleStatus
}) {
  return (
    <main className={`px-4 sm:px-5 lg:px-6 py-6 sm:py-7 lg:py-8 grid grid-cols-12 gap-4 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
      {activeTab !== 'Dashboard' ? (
        <section className="col-span-12 bg-white rounded-2xl border border-outline-variant p-12 text-center flex flex-col items-center justify-center min-h-[500px]">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
            <Calendar className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-primary mb-2">{activeTab} Section</h2>
          <button onClick={() => setActiveTab('Dashboard')} className="mt-6 px-4 py-2 bg-primary text-on-primary rounded-xl text-sm font-bold hover:bg-primary-container">
            Back to Dashboard Workspace
          </button>
        </section>
      ) : (
        <>
          <section className="col-span-12 xl:col-span-8 space-y-6">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-[clamp(1.2rem,1.8vw,1.45rem)] leading-tight font-bold text-primary tracking-tight">Weekly Planner &amp; Schedule</h2>
                <p className="text-[clamp(0.68rem,1.1vw,0.8rem)] tracking-wide text-on-surface-variant mt-1">NOVEMBER 13 - 19, 2023</p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedDate(14)}
                  className="h-8 px-3.5 rounded-xl border border-outline-variant text-[11px] font-semibold text-on-surface hover:bg-surface-container"
                >
                  Today
                </button>
                <div className="h-8 flex rounded-xl border border-outline-variant overflow-hidden">
                  <button onClick={handlePrevDay} disabled={selectedDate === 13} className="w-8 grid place-items-center hover:bg-surface-container disabled:opacity-40">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button onClick={handleNextDay} disabled={selectedDate === 19} className="w-8 grid place-items-center border-l border-outline-variant hover:bg-surface-container disabled:opacity-40">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2 border-b border-outline-variant/70 pb-5">
              {calendarDays.map((day) => {
                const isActive = selectedDate === day.date;
                return (
                  <button
                    key={day.date}
                    onClick={() => handleDaySelect(day.date)}
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

            <div className="space-y-3">
              {filteredMeetings.length === 0 ? (
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
                  <div key={meeting.id} className="grid grid-cols-[68px_1fr] gap-3 group">
                    <div className="text-right pt-5.5">
                      <span className="text-[12px] tracking-wide text-outline">{meeting.time}{ meeting.endTime ? ' - ' + meeting.endTime : ''}</span>
                    </div>

                    <div className="relative pl-4 border-l-2 border-primary-fixed-dim/70">
                      <div className={`premium-card min-h-[84px] rounded-xl border border-outline-variant/70 bg-white px-3.5 py-3 flex items-center justify-between ${meeting.opacityClass || ''}`}>
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`w-1 h-7 rounded-full ${meeting.leftBarBg}`} />
                          <div>
                            <h4 className="text-[15px] font-semibold leading-none text-on-surface">{meeting.title}</h4>
                            <span className={`inline-flex mt-1.5 px-2 py-0.5 rounded-md text-[10px] ${meeting.tagColor}`}>{meeting.tag}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          {meeting.isActive && (
                            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-primary/20 bg-primary/5">
                              <CircleDot className="w-4 h-4 text-primary" />
                              <span className="text-[10px] text-primary font-bold tracking-wider">ACTIVE</span>
                            </div>
                          )}

                          {meeting.isPinned && <Pin className="w-4 h-4 text-tertiary fill-current" />}

                          {meeting.participants && meeting.participants.length > 0 && (
                            <div className="flex -space-x-2">
                              {meeting.participants.slice(0, 2).map((avatar, idx) => (
                                <img key={idx} src={avatar} alt="" className="w-6 h-6 rounded-full border-2 border-white" />
                              ))}
                              {meeting.plusCount && (
                                <div className="w-6 h-6 rounded-full bg-primary-fixed text-on-primary-fixed-variant border-2 border-white text-[10px] font-bold grid place-items-center">+{meeting.plusCount}</div>
                              )}
                            </div>
                          )}

                          <button
                            onClick={() => {
                              if (confirm(`Remove "${meeting.title}" schedule card?`)) {
                                setMeetings(meetings.filter((m) => m.id !== meeting.id));
                              }
                            }}
                            className="opacity-0 group-hover:opacity-100 p-2 rounded-md hover:bg-slate-100 text-outline hover:text-error transition"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          <aside className="col-span-12 xl:col-span-4 space-y-4 sm:space-y-5">
            <div className="premium-panel rounded-2xl border border-outline-variant/70 bg-white p-4.5">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-[11px] font-bold uppercase tracking-[0.18em] text-on-surface-variant">Team Presence</h4>
                <MoreVertical className="w-4 h-4 text-outline" />
              </div>

              <div className="space-y-4">
                {teamMembers.map((member) => (
                  <div key={member.id} className="presence-row flex items-center justify-between group rounded-lg px-1.5 py-1.5">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img className={`w-10 h-10 rounded-full border border-outline-variant ${member.status === 'Offline' ? 'grayscale opacity-70' : ''}`} src={member.avatar} alt={member.name} />
                        <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-white ${member.statusColor}`} />
                      </div>
                      <div>
                        <p className="text-[14px] font-semibold text-on-surface leading-none">{member.name}</p>
                        <p className={`text-[10px] mt-1 ${member.textColor}`}>{member.status}</p>
                      </div>
                    </div>

                    <div className="relative">
                      <button
                        onClick={() => setActiveTeamMemberId(activeTeamMemberId === member.id ? null : member.id)}
                        className="text-[10px] text-primary font-bold hover:underline opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                      >
                        Change
                      </button>
                      {activeTeamMemberId === member.id && (
                        <div className="absolute right-0 top-6 w-32 bg-white rounded-lg shadow-xl border border-outline-variant z-50 p-1.5 space-y-1">
                          {['Active', 'In Focus', 'Offline', 'Blocked'].map((st) => (
                            <button key={st} onClick={() => toggleStatus(member.id, st)} className="w-full text-left text-[10px] px-2 py-1.5 rounded hover:bg-slate-100 flex items-center justify-between">
                              <span>{st}</span>
                              {member.status === st && <Check className="w-3 h-3" />}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="premium-panel rounded-2xl border border-outline-variant/70 bg-white p-4.5">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-[11px] font-bold uppercase tracking-[0.18em] text-on-surface-variant">Sprint 24</h4>
                <span className="text-[10px] px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant font-bold">4 days left</span>
              </div>

              <div className="space-y-5">
                <div>
                  <div className="flex justify-between text-[13px] font-semibold mb-2">
                    <span>Migration Tasks</span>
                    <span className="text-on-surface-variant">85%</span>
                  </div>
                  <div className="h-2 rounded-full bg-primary-fixed/45 overflow-hidden">
                    <div className="h-full w-[85%] bg-secondary-fixed-dim" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[13px] font-semibold mb-2">
                    <span>Core Refactor</span>
                    <span className="text-on-surface-variant">42%</span>
                  </div>
                  <div className="h-2 rounded-full bg-primary-fixed/45 overflow-hidden">
                    <div className="h-full w-[42%] bg-primary" />
                  </div>
                </div>
              </div>
            </div>

            <div className="premium-panel rounded-2xl border border-outline-variant/70 bg-white p-4.5">
              <h4 className="text-[11px] font-bold uppercase tracking-[0.18em] text-on-surface-variant mb-4">Team Consistency</h4>

              <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-error/5 border border-error/20 mb-4">
                <Flame className="w-5 h-5 text-error fill-current fire-float" />
                <span className="text-[13px] font-bold">18-Day Team Streak</span>
              </div>

              <div className="flex gap-1.5 mb-4">
                {['bg-secondary-container', 'bg-secondary-fixed-dim', 'bg-secondary', 'bg-secondary-fixed-dim', 'bg-secondary-container', 'bg-secondary', 'bg-secondary-fixed-dim', 'bg-primary-fixed', 'bg-secondary-container', 'bg-secondary-fixed-dim', 'bg-secondary', 'bg-secondary-fixed-dim', 'bg-secondary-container', 'bg-secondary'].map((c, i) => (
                  <div key={i} className={`heatmap-cell ${c} heatmap-cell-hover`} />
                ))}
              </div>

              <div className="flex justify-between text-[11px] text-on-surface-variant">
                <span>94% Participation</span>
                <span>Last 14 days</span>
              </div>
            </div>
          </aside>
        </>
      )}
    </main>
  );
}

export default Dashboard;
