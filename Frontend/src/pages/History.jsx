import React, { useState, useEffect, useMemo } from 'react';
import { Share2, Bookmark, Info } from 'lucide-react';
import { useToast } from '../hooks/useToast';

// Hook for encapsulating filter logic (High Cohesion)
function useHistoryFilters(historyLogs, searchQuery) {
  const [selectedMember, setSelectedMember] = useState('All Members');
  const [selectedDateRange, setSelectedDateRange] = useState('All Time');

  const uniqueMembers = useMemo(() => {
    return ['All Members', ...new Set(historyLogs.map(log => log.user))];
  }, [historyLogs]);

  const filteredLogs = useMemo(() => {
    return historyLogs.filter(log => {
      // 1. Search Query Filter
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesQuery = log.user.toLowerCase().includes(q) ||
               log.snippet.toLowerCase().includes(q) ||
               log.today.toLowerCase().includes(q) ||
               log.tomorrow.toLowerCase().includes(q) ||
               log.blockers.toLowerCase().includes(q);
        if (!matchesQuery) return false;
      }

      // 2. Member Filter
      if (selectedMember !== 'All Members' && log.user !== selectedMember) {
        return false;
      }

      // 3. Date Range Filter
      if (selectedDateRange !== 'All Time') {
        const logDate = new Date(log.dateFull);
        const now = new Date();
        if (selectedDateRange === 'Today') {
          if (logDate.toDateString() !== now.toDateString()) return false;
        } else if (selectedDateRange === 'This Week') {
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          if (logDate < weekAgo) return false;
        } else if (selectedDateRange === 'This Month') {
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          if (logDate < monthAgo) return false;
        }
      }

      return true;
    });
  }, [historyLogs, searchQuery, selectedMember, selectedDateRange]);

  return {
    selectedMember, setSelectedMember,
    selectedDateRange, setSelectedDateRange,
    uniqueMembers, filteredLogs
  };
}

// Hook for encapsulating bookmark logic
function useBookmarks() {
  const [bookmarked, setBookmarked] = useState(() => {
    try {
      const stored = localStorage.getItem('kaizen_bookmarks');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem('kaizen_bookmarks', JSON.stringify(bookmarked));
  }, [bookmarked]);

  const toggleBookmark = (id) => {
    setBookmarked(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return { bookmarked, toggleBookmark };
}

function History({ isSidebarOpen, historyLogs, searchQuery = '' }) {
  const { toast } = useToast();
  const { 
    selectedMember, setSelectedMember, 
    selectedDateRange, setSelectedDateRange, 
    uniqueMembers, filteredLogs 
  } = useHistoryFilters(historyLogs, searchQuery);
  
  const { bookmarked, toggleBookmark } = useBookmarks();

  const [selectedLogId, setSelectedLogId] = useState(null);

  // Auto-select first log if none selected or if current selection is filtered out
  useEffect(() => {
    if (filteredLogs.length > 0) {
      if (!selectedLogId || !filteredLogs.find(log => log.id === selectedLogId)) {
        setSelectedLogId(filteredLogs[0].id);
      }
    } else {
      setSelectedLogId(null);
    }
  }, [filteredLogs, selectedLogId]);

  const selectedLog = historyLogs.find(log => log.id === selectedLogId) || filteredLogs[0];

  const handleShare = () => {
    if (!selectedLog) return;
    const shareUrl = `${window.location.origin}${window.location.pathname}?log=${selectedLog.id}`;
    navigator.clipboard.writeText(shareUrl)
      .then(() => toast.success('Link copied to clipboard!'))
      .catch(() => toast.error('Failed to copy link.'));
  };

  // Group filtered logs by dateGroup
  const groupedLogs = filteredLogs.reduce((acc, log) => {
    if (!acc[log.dateGroup]) {
      acc[log.dateGroup] = { color: log.dateGroupColor, logs: [] };
    }
    acc[log.dateGroup].logs.push(log);
    return acc;
  }, {});

  if (!selectedLog && filteredLogs.length === 0) {
    return (
      <div className={`flex items-center justify-center h-[calc(100vh-64px)] transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <div className="p-12 text-center text-on-surface-variant bg-white rounded-2xl border border-outline-variant">
          No history logs match the current filters.
        </div>
      </div>
    );
  }

  return (
    <div className={`flex h-[calc(100vh-64px)] overflow-hidden bg-white transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
      {/* Left Sidebar - Logs List */}
      <div className="w-[350px] flex-shrink-0 border-r border-outline-variant flex flex-col">
        <div className="p-6 border-b border-outline-variant">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-on-surface">History</h2>
            <span className="text-[10px] font-bold text-outline uppercase tracking-wider">Archived Logs</span>
          </div>
          <div className="flex gap-2">
            <select 
              value={selectedMember}
              onChange={(e) => setSelectedMember(e.target.value)}
              className="flex-1 px-3 py-1.5 bg-[#f4f7fa] border border-outline-variant/40 rounded text-sm text-on-surface font-medium hover:bg-surface-container-highest transition-colors cursor-pointer appearance-none"
              style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23131313%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right .7em top 50%', backgroundSize: '.65em auto' }}
            >
              {uniqueMembers.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            <select 
              value={selectedDateRange}
              onChange={(e) => setSelectedDateRange(e.target.value)}
              className="flex-1 px-3 py-1.5 border border-outline-variant/40 rounded text-sm text-on-surface font-medium hover:bg-surface-container-highest transition-colors cursor-pointer appearance-none"
              style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23131313%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right .7em top 50%', backgroundSize: '.65em auto' }}
            >
              <option value="All Time">All Time</option>
              <option value="Today">Today</option>
              <option value="This Week">This Week</option>
              <option value="This Month">This Month</option>
            </select>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 pt-4 space-y-8">
          {Object.entries(groupedLogs).map(([date, group]) => (
            <div key={date}>
              <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold tracking-wider mb-4 ${group.color}`}>
                {date}
              </span>
              <div className="space-y-3">
                {group.logs.map(log => (
                  <div
                    key={log.id}
                    onClick={() => setSelectedLogId(log.id)}
                    className={`p-4 rounded-lg border transition-all cursor-pointer ${
                      selectedLogId === log.id 
                        ? 'border-primary shadow-sm bg-white' 
                        : 'border-transparent hover:bg-surface-container-highest/30'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <img src={log.avatar} alt={log.user} className="w-6 h-6 rounded-full" />
                        <span className="text-sm font-bold text-on-surface">{log.user}</span>
                      </div>
                      <span className="text-[10px] text-outline font-medium mt-1">{log.time}</span>
                    </div>
                    <p className="text-sm text-on-surface-variant line-clamp-2 leading-relaxed">
                      {log.snippet}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Content - Log Details */}
      {selectedLog && (
        <div className="flex-1 overflow-y-auto bg-white p-12">
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-start mb-16">
              <div className="flex items-center gap-4">
                <img src={selectedLog.avatar} alt={selectedLog.user} className="w-14 h-14 rounded-full border-2 border-white shadow-md" />
                <div>
                  <h1 className="text-3xl font-bold text-on-surface mb-1">{selectedLog.user}</h1>
                  <div className="flex items-center text-sm text-on-surface-variant">
                    <span className="font-medium">{selectedLog.role}</span>
                    <span className="mx-2">•</span>
                    <span className="font-semibold text-[#4f7c9e]">{selectedLog.dateFull}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={handleShare} className="p-2 border border-outline-variant/60 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest transition-colors cursor-pointer">
                  <Share2 className="w-5 h-5" />
                </button>
                <button onClick={() => toggleBookmark(selectedLog.id)} className={`p-2 border border-outline-variant/60 rounded-lg transition-colors cursor-pointer ${bookmarked[selectedLog.id] ? 'text-primary bg-primary-container/20' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest'}`}>
                  <Bookmark className={`w-5 h-5 ${bookmarked[selectedLog.id] ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>

            {/* Timeline View */}
            <div className="relative pl-6 space-y-16">
              {/* Vertical Line */}
              <div className="absolute left-[7px] top-4 bottom-8 w-[2px] bg-outline-variant/30"></div>

              {/* Today */}
              <div className="relative">
                <div className="absolute -left-[27px] top-1 w-4 h-4 rounded-full bg-[#6a8775] border-4 border-white shadow-sm"></div>
                <h3 className="text-xs font-bold text-[#6a8775] tracking-widest uppercase mb-4">WHAT I DID TODAY</h3>
                <div className="bg-[#f4f7fa] rounded-xl p-6 text-sm text-on-surface leading-relaxed whitespace-pre-wrap shadow-sm border border-outline-variant/20">
                  {selectedLog.today}
                </div>
              </div>

              {/* Tomorrow */}
              <div className="relative">
                <div className="absolute -left-[27px] top-1 w-4 h-4 rounded-full bg-[#4f7c9e] border-4 border-white shadow-sm"></div>
                <h3 className="text-xs font-bold text-[#4f7c9e] tracking-widest uppercase mb-4">PLANS FOR TOMORROW</h3>
                <div className="bg-[#f4f7fa] rounded-xl p-6 text-sm text-on-surface leading-relaxed shadow-sm border border-outline-variant/20">
                  {selectedLog.tomorrow}
                </div>
              </div>

              {/* Blockers */}
              <div className="relative">
                <div className="absolute -left-[27px] top-1 w-4 h-4 rounded-full bg-[#8675a8] border-4 border-white shadow-sm"></div>
                <h3 className="text-xs font-bold text-[#8675a8] tracking-widest uppercase mb-4">BLOCKERS</h3>
                <div className="bg-[#f4f7fa] rounded-xl p-6 text-sm text-on-surface leading-relaxed shadow-sm border border-outline-variant/20 flex items-center gap-3">
                  {!selectedLog.hasBlockers && <Info className="w-5 h-5 text-on-surface-variant" />}
                  {selectedLog.blockers}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default History;
