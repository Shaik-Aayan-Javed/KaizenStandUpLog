import React, { useState, useEffect } from 'react';
import { Share2, Bookmark, Info, ChevronDown } from 'lucide-react';

function History({ isSidebarOpen, historyLogs, searchQuery = '' }) {
  const filteredLogs = historyLogs.filter(log => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return log.user.toLowerCase().includes(q) ||
           log.snippet.toLowerCase().includes(q) ||
           log.today.toLowerCase().includes(q) ||
           log.tomorrow.toLowerCase().includes(q) ||
           log.blockers.toLowerCase().includes(q);
  });

  const [selectedLogId, setSelectedLogId] = useState(filteredLogs[0]?.id || historyLogs[0]?.id || 1);
  const [bookmarked, setBookmarked] = useState({});

  useEffect(() => {
    if (!filteredLogs.find(log => log.id === selectedLogId) && filteredLogs.length > 0) {
      setSelectedLogId(filteredLogs[0].id);
    }
  }, [filteredLogs, selectedLogId]);

  const selectedLog = historyLogs.find(log => log.id === selectedLogId) || historyLogs[0];

  const handleBookmark = () => {
    setBookmarked(prev => ({ ...prev, [selectedLogId]: !prev[selectedLogId] }));
  };

  const handleShare = () => {
    alert(`Sharing log for ${selectedLog.user}...`);
  };

  // Group filtered logs by dateGroup
  const groupedLogs = filteredLogs.reduce((acc, log) => {
    if (!acc[log.dateGroup]) {
      acc[log.dateGroup] = { color: log.dateGroupColor, logs: [] };
    }
    acc[log.dateGroup].logs.push(log);
    return acc;
  }, {});

  if (!selectedLog) {
    return <div className="p-12 text-center text-on-surface-variant">No history logs available.</div>;
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
            <button onClick={() => alert('Filter by member coming soon!')} className="flex-1 flex items-center justify-between px-3 py-1.5 bg-[#f4f7fa] border border-outline-variant/40 rounded text-sm text-on-surface font-medium hover:bg-surface-container-highest transition-colors cursor-pointer">
              All Members
              <ChevronDown className="w-4 h-4 text-outline" />
            </button>
            <button onClick={() => alert('Filter by date coming soon!')} className="flex-1 flex items-center justify-between px-3 py-1.5 border border-outline-variant/40 rounded text-sm text-on-surface font-medium hover:bg-surface-container-highest transition-colors cursor-pointer">
              This Month
              <ChevronDown className="w-4 h-4 text-outline" />
            </button>
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
              <button onClick={handleBookmark} className={`p-2 border border-outline-variant/60 rounded-lg transition-colors cursor-pointer ${bookmarked[selectedLogId] ? 'text-primary bg-primary-container/20' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest'}`}>
                <Bookmark className={`w-5 h-5 ${bookmarked[selectedLogId] ? 'fill-current' : ''}`} />
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
    </div>
  );
}

export default History;
