import React, { useMemo } from 'react';
import { Flame, MoreVertical, Check } from 'lucide-react';
import { SkeletonTeamMember } from '../ui/Skeleton';
import { useTeam } from '../../context/TeamContext';
import { useChat } from '../../context/ChatContext';

const sprintCategoryKeys = {
  '#analysis': 'analysis',
  '#design': 'design',
  '#development': 'development',
  '#testing': 'testing',
  '#engineering': 'development',
  '#architecture': 'analysis',
  '#product': 'design',
  '#management': 'testing',
};

function getSprintCategory(tag) {
  return sprintCategoryKeys[(tag || '').toLowerCase()] || null;
}

export function SprintPanel({ meetings }) {
  const { teamMembers, activeTeamMemberId, setActiveTeamMemberId, toggleStatus } = useTeam();
  const { historyLogs } = useChat();

  const categories = ['analysis', 'design', 'development', 'testing'];
  const sprintMetrics = categories.reduce((acc, category) => {
    const list = (meetings || []).filter((m) => getSprintCategory(m.tag) === category);
    const completed = list.filter((m) => m.completed).length;
    acc[`${category}Percent`] = list.length === 0 ? 0 : Math.round((completed / list.length) * 100);
    return acc;
  }, {});

  // Calculate dynamic team consistency metrics
  const { heatmapColors, participation, streak } = useMemo(() => {
    const today = new Date();
    
    // Create activity map
    const activityByDate = {};
    
    (historyLogs || []).forEach(log => {
      // Safely handle dateFull which is expected to be 'YYYY-MM-DD'
      if (log.dateFull) {
        activityByDate[log.dateFull] = (activityByDate[log.dateFull] || 0) + 1;
      }
    });
    
    (meetings || []).filter(m => m.completed).forEach(m => {
      if (m.date) {
        activityByDate[m.date] = (activityByDate[m.date] || 0) + 1;
      }
    });

    const last14Days = Array.from({ length: 14 }).map((_, i) => {
      const d = new Date(today);
      d.setDate(d.getDate() - (13 - i));
      return d.toISOString().split('T')[0];
    });

    const colors = last14Days.map(dateStr => {
      const count = activityByDate[dateStr] || 0;
      if (count === 0) return 'bg-secondary-container/40';
      if (count <= 2) return 'bg-secondary-fixed-dim';
      if (count <= 4) return 'bg-secondary';
      return 'bg-primary-fixed';
    });

    const activeDays = last14Days.filter(dateStr => activityByDate[dateStr] > 0).length;
    const partPercent = Math.round((activeDays / 14) * 100);

    // Calculate streak (consecutive days backward from today)
    let currentStreak = 0;
    // Look back up to 365 days
    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      
      if (activityByDate[dateStr] > 0) {
        currentStreak++;
      } else if (i > 0) {
        // If today has 0, we don't break the streak yet (maybe they haven't worked yet today).
        // But if yesterday has 0, the streak is broken.
        break;
      }
    }

    return { heatmapColors: colors, participation: partPercent, streak: currentStreak };
  }, [historyLogs, meetings]);

  return (
    <aside className="col-span-12 xl:col-span-4 space-y-4 sm:space-y-5">
      {/* Team Presence */}
      <div className="premium-panel rounded-2xl border border-outline-variant/70 bg-white p-4.5">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-[11px] font-bold uppercase tracking-[0.18em] text-on-surface-variant">Team Presence</h4>
          <MoreVertical className="w-4 h-4 text-outline" />
        </div>
        <div className="space-y-4">
          {teamMembers.length === 0
            ? Array.from({ length: 3 }).map((_, i) => <SkeletonTeamMember key={i} />)
            : teamMembers.map((member) => (
                <div key={member.id} className="presence-row flex items-center justify-between group rounded-lg px-1.5 py-1.5">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        className={`w-10 h-10 rounded-full border border-outline-variant ${member.status === 'Offline' ? 'grayscale opacity-70' : ''}`}
                        src={member.avatar}
                        alt={member.name}
                      />
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
                          <button
                            key={st}
                            onClick={() => toggleStatus(member.id, st)}
                            className="w-full text-left text-[10px] px-2 py-1.5 rounded hover:bg-slate-100 flex items-center justify-between"
                          >
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

      {/* Sprint Progress */}
      <div className="premium-panel rounded-2xl border border-outline-variant/70 bg-white p-4.5">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-[11px] font-bold uppercase tracking-[0.18em] text-on-surface-variant">Sprint 24</h4>
          <span className="text-[10px] px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant font-bold">4 days left</span>
        </div>
        <div className="space-y-5">
          {[
            { label: 'Analysis', key: 'analysisPercent', color: 'var(--color-secondary)' },
            { label: 'Design', key: 'designPercent', color: 'var(--color-primary)' },
            { label: 'Development', key: 'developmentPercent', color: 'var(--color-secondary)' },
            { label: 'Testing', key: 'testingPercent', color: 'var(--color-primary)' },
          ].map(({ label, key, color }) => (
            <div key={key}>
              <div className="flex justify-between text-[13px] font-semibold mb-2">
                <span>{label}</span>
                <span className="text-on-surface-variant">{sprintMetrics[key]}%</span>
              </div>
              <div className="h-2 rounded-full bg-primary-fixed/45 overflow-hidden">
                <div className="h-full transition-all duration-500" style={{ width: `${sprintMetrics[key]}%`, backgroundColor: color }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Team Consistency */}
      <div className="premium-panel rounded-2xl border border-outline-variant/70 bg-white p-4.5">
        <h4 className="text-[11px] font-bold uppercase tracking-[0.18em] text-on-surface-variant mb-4">Team Consistency</h4>
        <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-error/5 border border-error/20 mb-4">
          <Flame className="w-5 h-5 text-error fill-current fire-float" />
          <span className="text-[13px] font-bold">{streak}-Day Team Streak</span>
        </div>
        <div className="flex gap-1.5 mb-4">
          {heatmapColors.map((c, i) => (
            <div key={i} className={`heatmap-cell ${c} heatmap-cell-hover`} />
          ))}
        </div>
        <div className="flex justify-between text-[11px] text-on-surface-variant">
          <span>{participation}% Participation</span>
          <span>Last 14 days</span>
        </div>
      </div>
    </aside>
  );
}
