import React, { useMemo, useState, useEffect } from 'react';
import Dashboard from './pages/Dashboard';
import Teams from './pages/Teams';
import Standups from './pages/Standups';
import History from './pages/History';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Register from './pages/Register';
import LeftSidebar from './components/LeftSidebar';
import TopBar from './components/TopBar';
import NewStandupModal from './components/NewStandupModal';

const CALENDAR_DAYS = [
  { label: 'MON', date: 13, labelFull: 'Monday' },
  { label: 'TUE', date: 14, labelFull: 'Tuesday' },
  { label: 'WED', date: 15, labelFull: 'Wednesday' },
  { label: 'THU', date: 16, labelFull: 'Thursday' },
  { label: 'FRI', date: 17, labelFull: 'Friday' },
  { label: 'SAT', date: 18, labelFull: 'Saturday', dim: true },
  { label: 'SUN', date: 19, labelFull: 'Sunday', dim: true }
];

function App() {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [selectedDate, setSelectedDate] = useState(14);
  const [meetings, setMeetings] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isNewStandupOpen, setIsNewStandupOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeTeamMemberId, setActiveTeamMemberId] = useState(null);

  const [groups, setGroups] = useState([]);
  const [dms, setDms] = useState([]);
  const [activeChatId, setActiveChatId] = useState('engineering-core');
  const [chatMessagesLog, setChatMessagesLog] = useState({});
  const [chatInputText, setChatInputText] = useState('');

  const [formData, setFormData] = useState({ title: '', time: '10:00', endTime: '11:00', tag: '#engineering', type: 'general', status: '', isActive: false, isPinned: false });
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'Sarah Kim tagged you in #architecture sync', time: '5m ago', read: false },
    { id: 2, text: 'Daily Standup scheduled for 09:00', time: '1h ago', read: true }
  ]);
  const [chatMessages, setChatMessages] = useState([{ id: 1, sender: 'Sarah Kim', text: 'Are we set for backend sync?', time: '10:22 AM' }]);
  const [newMessage, setNewMessage] = useState('');
  const [historyLogs, setHistoryLogs] = useState([]);

  const [registeredUsers, setRegisteredUsers] = useState(() => {
    const savedUsers = window.localStorage.getItem('kaizen_registered_users');
    return savedUsers ? JSON.parse(savedUsers) : [];
  });

  const [authUser, setAuthUser] = useState(() => {
    const savedUser = window.localStorage.getItem('kaizen_auth_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => !!window.localStorage.getItem('kaizen_auth_user'));
  const [authMode, setAuthMode] = useState('login');

  useEffect(() => {
    window.localStorage.setItem('kaizen_registered_users', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  useEffect(() => {
    if (authUser) {
      window.localStorage.setItem('kaizen_auth_user', JSON.stringify(authUser));
    } else {
      window.localStorage.removeItem('kaizen_auth_user');
    }
    setIsAuthenticated(!!authUser);
  }, [authUser]);

  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchAllData = async () => {
      try {
        const [meetingsRes, teamRes, groupsRes, historyRes, chatRes] = await Promise.all([
          fetch("http://localhost:5000/api/meetings"),
          fetch("http://localhost:5000/api/teammembers"),
          fetch("http://localhost:5000/api/groups"),
          fetch("http://localhost:5000/api/historylogs"),
          fetch("http://localhost:5000/api/chatmessages")
        ]);
        const mapId = (arr) => arr.map(item => ({ ...item, id: item._id }));
        
        const m = await meetingsRes.json();
        const t = await teamRes.json();
        const g = await groupsRes.json();
        const h = await historyRes.json();
        const c = await chatRes.json();
        
        setMeetings(mapId(m));
        setTeamMembers(mapId(t));
        
        const groupsWithId = mapId(g);
        setGroups(groupsWithId.filter(x => x.type === 'channel'));
        setDms(groupsWithId.filter(x => x.type === 'dm'));
        setHistoryLogs(mapId(h));
        
        const chatMap = {};
        c.forEach(msg => {
          if (!chatMap[msg.groupId]) chatMap[msg.groupId] = [];
          chatMap[msg.groupId].push({ ...msg, id: msg._id });
        });
        setChatMessagesLog(chatMap);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchAllData();
  }, [isAuthenticated]);

  const handleAddHistoryLog = async (newLog) => {
    try {
      const res = await fetch("http://localhost:5000/api/historylogs", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(newLog)
      });
      const saved = await res.json();
      setHistoryLogs([{ ...saved, id: saved._id }, ...historyLogs]);
    } catch (err) { console.error(err); }
  };

  const filteredMeetings = useMemo(() => meetings.filter((m) => m.day === selectedDate && (m.title.toLowerCase().includes(searchQuery.toLowerCase()) || m.tag.toLowerCase().includes(searchQuery.toLowerCase()))), [meetings, selectedDate, searchQuery]);

  const handleLogin = async ({ email, password }) => {
    try {
      const response = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        setAuthUser(data.user);
        setActiveTab('Dashboard');
        return { success: true };
      } else { return { success: false, message: data.message || "Login failed" }; }
    } catch (error) { return { success: false, message: "Could not connect to server." }; }
  };

  const handleLogout = () => {
    setAuthUser(null);
  };


  const handleRegister = async ({ fullName, email, password }) => {
    try {
      const response = await fetch("http://localhost:5000/api/users/add-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: fullName, email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        setAuthUser(data.user);
        setActiveTab('Dashboard');
        return { success: true };
      } else { return { success: false, message: data.message || "Registration failed" }; }
    } catch (error) { return { success: false, message: "Could not connect to server." }; }
  };

  const handleDaySelect = (day) => setSelectedDate(day);
  const handleNextDay = () => {
    const currentIndex = CALENDAR_DAYS.findIndex((d) => d.date === selectedDate);
    if (currentIndex < CALENDAR_DAYS.length - 1) setSelectedDate(CALENDAR_DAYS[currentIndex + 1].date);
  };
  const handlePrevDay = () => {
    const currentIndex = CALENDAR_DAYS.findIndex((d) => d.date === selectedDate);
    if (currentIndex > 0) setSelectedDate(CALENDAR_DAYS[currentIndex - 1].date);
  };

  const handleCreateStandup = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    const newMeeting = { time: formData.time, endTime: formData.endTime, title: formData.title, tag: formData.tag, borderClass: 'border-primary', leftBarBg: 'bg-primary', tagColor: 'bg-primary-fixed text-on-primary-fixed-variant', day: selectedDate, isActive: formData.isActive, isPinned: formData.isPinned };
    try {
      const res = await fetch("http://localhost:5000/api/meetings", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(newMeeting)
      });
      const saved = await res.json();
      setMeetings([...meetings, { ...saved, id: saved._id }]);
    } catch(err) { console.error(err); }
    setIsNewStandupOpen(false);
    setFormData({ title: '', time: '10:00', endTime: '11:00', tag: '#engineering', type: 'general', status: '', isActive: false, isPinned: false });
  };

  const toggleStatus = async (memberId, newStatus) => {
    const statusMap = {
      Active: { color: 'bg-secondary-fixed-dim', text: 'text-secondary' },
      'In Focus': { color: 'bg-primary-fixed-dim', text: 'text-primary' },
      Offline: { color: 'bg-outline-variant', text: 'text-on-surface-variant' },
      Blocked: { color: 'bg-tertiary-fixed-dim', text: 'text-tertiary' }
    };
    try {
      const res = await fetch(`http://localhost:5000/api/teammembers/${memberId}`, {
        method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: newStatus, statusColor: statusMap[newStatus].color, textColor: statusMap[newStatus].text })
      });
      const updated = await res.json();
      setTeamMembers(teamMembers.map((m) => (m.id === memberId ? { ...updated, id: updated._id } : m)));
    } catch(err) { console.error(err); }
    setActiveTeamMemberId(null);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setChatMessages([...chatMessages, { id: Date.now(), sender: 'You', text: newMessage, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    setNewMessage('');
  };

  const handleSendTeamMessage = async (e) => {
    if (e) e.preventDefault();
    if (!chatInputText.trim()) return;
    const msgObj = { 
      groupId: activeChatId, 
      sender: authUser?.name || authUser?.email || 'You', 
      avatar: authUser?.avatar || 'https://i.pravatar.cc/150?img=47', 
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), 
      text: chatInputText 
    };
    try {
      const res = await fetch("http://localhost:5000/api/chatmessages", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(msgObj)
      });
      const saved = await res.json();
      const finalMsg = { ...saved, id: saved._id };
      setChatMessagesLog({ ...chatMessagesLog, [activeChatId]: [...(chatMessagesLog[activeChatId] || []), finalMsg] });
    } catch(err) { console.error(err); }
    setChatInputText('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendTeamMessage();
    }
  };

  const handleAddReaction = async (messageId, emoji) => {
    try {
      const res = await fetch(`http://localhost:5000/api/chatmessages/${messageId}/react`, {
        method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ emoji })
      });
      const updated = await res.json();
      const updatedMsg = { ...updated, id: updated._id };
      setChatMessagesLog({
        ...chatMessagesLog,
        [activeChatId]: chatMessagesLog[activeChatId].map((msg) => msg.id === messageId ? updatedMsg : msg)
      });
    } catch(err) { console.error(err); }
  };

  const handleCreateGroup = async () => {
    const name = prompt('Enter new Group / Channel Name (without spaces):');
    if (!name) return;
    const cleanName = name.trim().toLowerCase().replace(/\s+/g, '-');
    if (!cleanName) return;
    const newChan = { groupId: cleanName, name: cleanName, type: 'channel', members: 1, desc: 'General project workspace' };
    try {
      const res = await fetch("http://localhost:5000/api/groups", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(newChan)
      });
      const saved = await res.json();
      setGroups([...groups, { ...saved, id: saved._id }]);
      setChatMessagesLog({ ...chatMessagesLog, [cleanName]: [] });
      setActiveChatId(cleanName);
    } catch(err) { console.error(err); }
  };

  const markAllNotificationsAsRead = () => setNotifications(notifications.map((n) => ({ ...n, read: true })));

  const activeChatInfo = useMemo(() => {
    const selectedGroup = groups.find((g) => g.groupId === activeChatId);
    if (selectedGroup) return selectedGroup;
    const selectedDm = dms.find((d) => d.groupId === activeChatId);
    if (selectedDm) return { ...selectedDm, desc: selectedDm.status === 'Active' ? 'Active now' : 'Offline' };
    return { name: 'Chat Workspace', members: 0, desc: '' };
  }, [groups, dms, activeChatId]);

  if (!isAuthenticated) {
    return authMode === 'register' ? (
      <Register onRegister={handleRegister} switchToLogin={() => setAuthMode('login')} />
    ) : (
      <Login onLogin={handleLogin} switchToRegister={() => setAuthMode('register')} />
    );
  }

  return (
    <div className="min-h-screen bg-background text-on-surface font-sans antialiased overflow-x-hidden">
      <LeftSidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setIsNewStandupOpen={setIsNewStandupOpen}
        handleLogout={handleLogout}
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
        user={authUser}
      />

      {activeTab === 'Teams' && (
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
      )}

      {activeTab === 'Standups' && (
        <Standups setActiveTab={setActiveTab} isSidebarOpen={isSidebarOpen} handleAddHistoryLog={handleAddHistoryLog} userName={authUser?.fullName} />
      )}

      {activeTab === 'History' && (
        <History isSidebarOpen={isSidebarOpen} historyLogs={historyLogs} searchQuery={searchQuery} />
      )}

      {activeTab === 'Settings' && (
        <Settings isSidebarOpen={isSidebarOpen} />
      )}

      {activeTab !== 'Teams' && activeTab !== 'Standups' && activeTab !== 'History' && activeTab !== 'Settings' && (
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
