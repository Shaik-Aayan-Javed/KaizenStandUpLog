import React, { useState, useEffect } from 'react';
import { History, Calendar, Ban } from 'lucide-react';
import { useToast } from '../hooks/useToast';

function Standups({ setActiveTab, isSidebarOpen, handleAddHistoryLog, userName, user }) {
  const [yesterday, setYesterday] = useState('');
  const [today, setToday] = useState('');
  const [blockers, setBlockers] = useState('');
  const [lastSaved, setLastSaved] = useState(null);
  
  const { toast } = useToast();

  // Load from localStorage on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem('kaizen_standup_draft');
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        if (parsed.yesterday) setYesterday(parsed.yesterday);
        if (parsed.today) setToday(parsed.today);
        if (parsed.blockers) setBlockers(parsed.blockers);
        if (parsed.timestamp) setLastSaved(new Date(parsed.timestamp));
      } catch (e) {
        console.error('Failed to parse draft from localStorage');
      }
    }
  }, []);

  // Auto save draft to localStorage
  useEffect(() => {
    // Only save if there's actual content to save
    if (!yesterday && !today && !blockers && !lastSaved) return;
    
    const timer = setTimeout(() => {
      localStorage.setItem('kaizen_standup_draft', JSON.stringify({
        yesterday, today, blockers, timestamp: Date.now()
      }));
      setLastSaved(new Date());
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [yesterday, today, blockers]);

  const handleDiscard = () => {
    setYesterday('');
    setToday('');
    setBlockers('');
    localStorage.removeItem('kaizen_standup_draft');
    setLastSaved(null);
    if (setActiveTab) setActiveTab('Dashboard');
  };

  const handleSubmit = () => {
    if (!yesterday && !today && !blockers) return;
    
    if (handleAddHistoryLog) {
      const now = new Date();
      const optionsDateGroup = { month: 'short', day: 'numeric', year: 'numeric' };
      const dateGroup = now.toLocaleDateString('en-US', optionsDateGroup).toUpperCase();
      
      const newLog = {
        id: Date.now(),
        dateGroup: dateGroup,
        dateGroupColor: 'bg-[#d5ecd4] text-[#4a7251]', // Using the green color for new logs
        user: user?.name || 'Alex Rivera',
        role: user?.title || 'Lead Developer',
        time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        dateFull: now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        avatar: user?.avatar || 'https://i.pravatar.cc/150?img=47',
        snippet: (yesterday || today || blockers).substring(0, 50) + '...',

        today: yesterday || 'Nothing entered.',
        tomorrow: today || 'Nothing entered.',
        blockers: blockers || 'No critical blockers today.',
        hasBlockers: !!blockers
      };
      
      handleAddHistoryLog(newLog);
    }
    
    toast.success('Standup submitted successfully!');
    setYesterday('');
    setToday('');
    setBlockers('');
    localStorage.removeItem('kaizen_standup_draft');
    setLastSaved(null);
    if (setActiveTab) setActiveTab('History');
  };

  const getSavedText = () => {
    if (!lastSaved) return 'Not saved';
    const mins = Math.floor((Date.now() - lastSaved.getTime()) / 60000);
    if (mins === 0) return 'Draft saved just now';
    if (mins === 1) return 'Draft saved 1 min ago';
    return `Draft saved ${mins} mins ago`;
  };

  return (
    <div className={`transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
      <div className="p-8 max-w-4xl mx-auto">
        <div className="mb-10 border-b border-outline-variant pb-8">
          <p className="text-xs font-bold tracking-widest text-outline uppercase mb-2">DAILY STANDUP</p>
          <h2 className="text-3xl font-bold text-on-surface mb-2">Good morning, {userName?.split(' ')[0] || 'there'}.</h2>
          <p className="text-on-surface-variant text-sm">
            Capture your progress and plans for today. Keep it concise to help the team stay aligned.
          </p>
        </div>

      <div className="space-y-8">
        {/* Yesterday */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-on-surface">
            <History className="w-4 h-4 text-on-surface-variant" />
            <h3 className="font-semibold text-sm">What did you do yesterday?</h3>
          </div>
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#4f7c9e] rounded-l-lg"></div>
            <textarea
              className="w-full bg-[#f4f7fa] border border-outline-variant/30 rounded-lg p-4 pl-6 min-h-[100px] text-sm focus:outline-none focus:ring-1 focus:ring-primary text-on-surface resize-none"
              placeholder="Implemented the new auth flow and fixed the race condition in the state manager..."
              value={yesterday}
              onChange={(e) => setYesterday(e.target.value)}
            />
          </div>
        </div>

        {/* Today */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-on-surface">
            <Calendar className="w-4 h-4 text-on-surface-variant" />
            <h3 className="font-semibold text-sm">What are you doing today?</h3>
          </div>
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#6a8775] rounded-l-lg"></div>
            <textarea
              className="w-full bg-[#f4f7fa] border border-outline-variant/30 rounded-lg p-4 pl-6 min-h-[100px] text-sm focus:outline-none focus:ring-1 focus:ring-primary text-on-surface resize-none"
              placeholder="Focusing on unit tests for the API layer and starting the documentation update..."
              value={today}
              onChange={(e) => setToday(e.target.value)}
            />
          </div>
        </div>

        {/* Blockers */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-on-surface">
            <Ban className="w-4 h-4 text-on-surface-variant" />
            <h3 className="font-semibold text-sm">Any blockers?</h3>
          </div>
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#8675a8] rounded-l-lg"></div>
            <textarea
              className="w-full bg-[#f4f7fa] border border-outline-variant/30 rounded-lg p-4 pl-6 min-h-[100px] text-sm focus:outline-none focus:ring-1 focus:ring-primary text-on-surface resize-none"
              placeholder="Waiting for the DevOps team to provision the new staging bucket."
              value={blockers}
              onChange={(e) => setBlockers(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-outline-variant/40 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-on-surface-variant">
          <span className={`w-2 h-2 rounded-full ${lastSaved ? 'bg-secondary' : 'bg-outline-variant'}`}></span>
          {getSavedText()}
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={handleDiscard}
            className="text-sm font-semibold text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
          >
            Discard
          </button>
          <button 
            onClick={handleSubmit}
            className="bg-[#4f7c9e] hover:bg-[#3f6583] text-white px-6 py-2.5 rounded-lg text-sm font-bold transition-colors cursor-pointer"
          >
            Submit Update
          </button>
        </div>
        </div>
      </div>
    </div>
  );
}

export default Standups;
