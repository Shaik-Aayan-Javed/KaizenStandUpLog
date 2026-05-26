import React, { useMemo, useState } from 'react';
import Dashboard from './pages/Dashboard';
import Teams from './pages/Teams';
import LeftSidebar from './components/LeftSidebar';
import TopBar from './components/TopBar';
import NewStandupModal from './components/NewStandupModal';

const INITIAL_MEETINGS = [
  { id: 1, time: '09:00', title: 'Daily Standup', tag: '#engineering', borderClass: 'border-secondary', leftBarBg: 'bg-secondary', tagColor: 'bg-secondary-container text-on-secondary-container', day: 14 },
  { id: 2, time: '10:30', title: 'Backend Sync', tag: '#architecture', borderClass: 'border-primary', leftBarBg: 'bg-primary', tagColor: 'bg-primary-fixed text-on-primary-fixed-variant', isActive: true, day: 14 },
  { id: 3, time: '13:00', title: 'Design Review', tag: '#product', borderClass: 'border-tertiary-container', leftBarBg: 'bg-tertiary-container', tagColor: 'bg-tertiary-fixed text-on-tertiary-fixed-variant', day: 14 },
  { id: 4, time: '15:00', title: 'Sprint Review', tag: '#management', borderClass: 'border-error', leftBarBg: 'bg-error', tagColor: 'bg-error-container text-on-error-container', isPinned: true, day: 14 }
];

const INITIAL_TEAM = [
  { id: 1, name: 'Jordan Dai', status: 'Active', statusColor: 'bg-secondary-fixed-dim', textColor: 'text-secondary', avatar: 'https://i.pravatar.cc/60?img=1' },
  { id: 2, name: 'Sarah Kim', status: 'In Focus', statusColor: 'bg-primary-fixed-dim', textColor: 'text-primary', avatar: 'https://i.pravatar.cc/60?img=2' },
  { id: 3, name: 'Ryan Lee', status: 'Offline', statusColor: 'bg-outline-variant', textColor: 'text-on-surface-variant', avatar: 'https://i.pravatar.cc/60?img=3' }
];

const CALENDAR_DAYS = [
  { label: 'MON', date: 13, labelFull: 'Monday' },
  { label: 'TUE', date: 14, labelFull: 'Tuesday' },
  { label: 'WED', date: 15, labelFull: 'Wednesday' },
  { label: 'THU', date: 16, labelFull: 'Thursday' },
  { label: 'FRI', date: 17, labelFull: 'Friday' },
  { label: 'SAT', date: 18, labelFull: 'Saturday', dim: true },
  { label: 'SUN', date: 19, labelFull: 'Sunday', dim: true }
];

const INITIAL_GROUPS = [
  { id: 'engineering-core', name: 'engineering-core', type: 'channel', members: 12, desc: 'Core development and infrastructure sync' },
  { id: 'product-sync', name: 'product-sync', type: 'channel', members: 8, desc: 'Product strategy and milestone alignment' }
];

const INITIAL_DMS = [
  { id: 'sarah-chen', name: 'Sarah Chen', type: 'dm', status: 'Active', avatar: 'https://i.pravatar.cc/60?img=5' },
  { id: 'alex-rivera', name: 'Alex Rivera', type: 'dm', status: 'Active', avatar: 'https://i.pravatar.cc/60?img=6' }
];

const INITIAL_MESSAGES = {
  'engineering-core': [{ id: 101, sender: 'Sarah Chen', avatar: 'https://i.pravatar.cc/60?img=5', time: '10:24 AM', text: 'Can someone review the logger architecture draft?', reactions: { '??': 2 } }],
  'product-sync': [],
  'sarah-chen': [],
  'alex-rivera': []
};

function App() {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [selectedDate, setSelectedDate] = useState(14);
  const [meetings, setMeetings] = useState(INITIAL_MEETINGS);
  const [teamMembers, setTeamMembers] = useState(INITIAL_TEAM);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isNewStandupOpen, setIsNewStandupOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeTeamMemberId, setActiveTeamMemberId] = useState(null);

  const [groups, setGroups] = useState(INITIAL_GROUPS);
  const [dms] = useState(INITIAL_DMS);
  const [activeChatId, setActiveChatId] = useState('engineering-core');
  const [chatMessagesLog, setChatMessagesLog] = useState(INITIAL_MESSAGES);
  const [chatInputText, setChatInputText] = useState('');

  const [formData, setFormData] = useState({ title: '', time: '10:00', tag: '#engineering', type: 'general', status: '' });
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'Sarah Kim tagged you in #architecture sync', time: '5m ago', read: false },
    { id: 2, text: 'Daily Standup scheduled for 09:00', time: '1h ago', read: true }
  ]);
  const [chatMessages, setChatMessages] = useState([{ id: 1, sender: 'Sarah Kim', text: 'Are we set for backend sync?', time: '10:22 AM' }]);
  const [newMessage, setNewMessage] = useState('');

  const filteredMeetings = useMemo(() => meetings.filter((m) => m.day === selectedDate && (m.title.toLowerCase().includes(searchQuery.toLowerCase()) || m.tag.toLowerCase().includes(searchQuery.toLowerCase()))), [meetings, selectedDate, searchQuery]);

  const handleDaySelect = (day) => setSelectedDate(day);
  const handleNextDay = () => {
    const currentIndex = CALENDAR_DAYS.findIndex((d) => d.date === selectedDate);
    if (currentIndex < CALENDAR_DAYS.length - 1) setSelectedDate(CALENDAR_DAYS[currentIndex + 1].date);
  };
  const handlePrevDay = () => {
    const currentIndex = CALENDAR_DAYS.findIndex((d) => d.date === selectedDate);
    if (currentIndex > 0) setSelectedDate(CALENDAR_DAYS[currentIndex - 1].date);
  };

  const handleCreateStandup = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    setMeetings([...meetings, { id: Date.now(), time: formData.time, title: formData.title, tag: formData.tag, borderClass: 'border-primary', leftBarBg: 'bg-primary', tagColor: 'bg-primary-fixed text-on-primary-fixed-variant', day: selectedDate }]);
    setIsNewStandupOpen(false);
    setFormData({ title: '', time: '10:00', tag: '#engineering', type: 'general', status: '' });
  };

  const toggleStatus = (memberId, newStatus) => {
    const statusMap = {
      Active: { color: 'bg-secondary-fixed-dim', text: 'text-secondary' },
      'In Focus': { color: 'bg-primary-fixed-dim', text: 'text-primary' },
      Offline: { color: 'bg-outline-variant', text: 'text-on-surface-variant' },
      Blocked: { color: 'bg-tertiary-fixed-dim', text: 'text-tertiary' }
    };
    setTeamMembers(teamMembers.map((m) => (m.id === memberId ? { ...m, status: newStatus, statusColor: statusMap[newStatus].color, textColor: statusMap[newStatus].text } : m)));
    setActiveTeamMemberId(null);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setChatMessages([...chatMessages, { id: Date.now(), sender: 'You', text: newMessage, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    setNewMessage('');
  };

  const handleSendTeamMessage = (e) => {
    if (e) e.preventDefault();
    if (!chatInputText.trim()) return;
    const newMsg = { id: Date.now(), sender: 'Alex Chen (You)', avatar: 'https://i.pravatar.cc/60?img=8', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), text: chatInputText };
    setChatMessagesLog({ ...chatMessagesLog, [activeChatId]: [...(chatMessagesLog[activeChatId] || []), newMsg] });
    setChatInputText('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendTeamMessage();
    }
  };

  const handleAddReaction = (messageId, emoji) => {
    setChatMessagesLog({
      ...chatMessagesLog,
      [activeChatId]: chatMessagesLog[activeChatId].map((msg) => {
        if (msg.id === messageId) {
          const reactions = { ...(msg.reactions || {}) };
          reactions[emoji] = (reactions[emoji] || 0) + 1;
          return { ...msg, reactions };
        }
        return msg;
      })
    });
  };

  const handleCreateGroup = () => {
    const name = prompt('Enter new Group / Channel Name (without spaces):');
    if (!name) return;
    const cleanName = name.trim().toLowerCase().replace(/\s+/g, '-');
    if (!cleanName) return;
    const newChan = { id: cleanName, name: cleanName, type: 'channel', members: 1, desc: 'General project workspace' };
    setGroups([...groups, newChan]);
    setChatMessagesLog({ ...chatMessagesLog, [cleanName]: [] });
    setActiveChatId(cleanName);
  };

  const markAllNotificationsAsRead = () => setNotifications(notifications.map((n) => ({ ...n, read: true })));

  const activeChatInfo = useMemo(() => {
    const selectedGroup = groups.find((g) => g.id === activeChatId);
    if (selectedGroup) return selectedGroup;
    const selectedDm = dms.find((d) => d.id === activeChatId);
    if (selectedDm) return { ...selectedDm, desc: selectedDm.status === 'Active' ? 'Active now' : 'Offline' };
    return { name: 'Chat Workspace', members: 0, desc: '' };
  }, [groups, dms, activeChatId]);

  return (
    <div className="min-h-screen bg-background text-on-surface font-sans antialiased overflow-x-hidden">
      <LeftSidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setIsNewStandupOpen={setIsNewStandupOpen}
      />

      <TopBar
        activeTab={activeTab}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isNotificationOpen={isNotificationOpen}
        setIsNotificationOpen={setIsNotificationOpen}
        isChatOpen={isChatOpen}
        setIsChatOpen={setIsChatOpen}
        notifications={notifications}
        markAllNotificationsAsRead={markAllNotificationsAsRead}
        chatMessages={chatMessages}
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        handleSendMessage={handleSendMessage}
      />

      {activeTab === 'Teams' ? (
        <Teams
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          groups={groups}
          dms={dms}
          activeChatId={activeChatId}
          setActiveChatId={setActiveChatId}
          activeChatInfo={activeChatInfo}
          handleCreateGroup={handleCreateGroup}
          chatMessagesLog={chatMessagesLog}
          handleAddReaction={handleAddReaction}
          chatInputText={chatInputText}
          setChatInputText={setChatInputText}
          handleKeyPress={handleKeyPress}
          handleSendTeamMessage={handleSendTeamMessage}
        />
      ) : (
        <Dashboard
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isSidebarOpen={isSidebarOpen}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          handlePrevDay={handlePrevDay}
          handleNextDay={handleNextDay}
          handleDaySelect={handleDaySelect}
          calendarDays={CALENDAR_DAYS}
          filteredMeetings={filteredMeetings}
          meetings={meetings}
          setMeetings={setMeetings}
          setIsNewStandupOpen={setIsNewStandupOpen}
          teamMembers={teamMembers}
          activeTeamMemberId={activeTeamMemberId}
          setActiveTeamMemberId={setActiveTeamMemberId}
          toggleStatus={toggleStatus}
        />
      )}

      <NewStandupModal
        isOpen={isNewStandupOpen}
        setIsNewStandupOpen={setIsNewStandupOpen}
        formData={formData}
        setFormData={setFormData}
        handleCreateStandup={handleCreateStandup}
        selectedDate={selectedDate}
        calendarDays={CALENDAR_DAYS}
      />
    </div>
  );
}

export default App;
