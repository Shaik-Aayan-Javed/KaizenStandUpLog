import React, { useState, useMemo } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { MeetingsProvider } from './context/MeetingsContext';
import { TeamProvider } from './context/TeamContext';
import { ChatProvider, useChat } from './context/ChatContext';

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
import { ToastContainer } from './components/ui/Toast';
import { useToast, ToastProvider } from './hooks/useToast';
import { useCalendar } from './hooks/useCalendar';
import { useMeetings } from './context/MeetingsContext';

// ─── Inner app (rendered once authenticated) ───────────────────────────
function AppShell() {
  const { authUser, authMode, setAuthMode, handleLogin, handleRegister, handleLogout, isAuthenticated } = useAuth();
  const { handleCreateStandup } = useMeetings();
  const { historyLogs, handleAddHistoryLog, groups, dms, activeChatId, setActiveChatId, chatMessagesLog, chatInputText, setChatInputText, handleKeyPress, handleSendTeamMessage, handleAddReaction, handleCreateGroup } = useChat();
  const { toasts, toast, removeToast } = useToast();
  const { selectedDate, calendarDays, handleDaySelect, handleNextDay, handlePrevDay, goToToday } = useCalendar();

  const [activeTab, setActiveTab] = useState(() => window.sessionStorage.getItem('kaizen_active_tab') || 'Dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isNewStandupOpen, setIsNewStandupOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [notifications] = useState([
    { id: 1, text: 'Sarah Kim tagged you in #analysis sync', time: '5m ago', read: false },
    { id: 2, text: 'Daily Standup scheduled for 09:00', time: '1h ago', read: true },
  ]);
  const [chatMessages, setChatMessages] = useState([{ id: 1, sender: 'Sarah Kim', text: 'Are we set for backend sync?', time: '10:22 AM' }]);
  const [newMessage, setNewMessage] = useState('');
  const [formData, setFormData] = useState({ title: '', time: '10:00', endTime: '11:00', tag: '#analysis', type: 'general', isActive: false, isPinned: false });

  React.useEffect(() => {
    window.sessionStorage.setItem('kaizen_active_tab', activeTab);
  }, [activeTab]);

  const markAllNotificationsAsRead = () => {};

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setChatMessages((prev) => [...prev, { id: Date.now(), sender: 'You', text: newMessage, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    setNewMessage('');
  };

  const activeChatInfo = useMemo(() => {
    const g = groups.find((g) => g.groupId === activeChatId);
    if (g) return g;
    const d = dms.find((d) => d.groupId === activeChatId);
    if (d) return { ...d, desc: d.status === 'Active' ? 'Active now' : 'Offline' };
    return { name: 'Chat Workspace', members: 0, desc: '' };
  }, [groups, dms, activeChatId]);

  const onCreateStandup = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    try {
      await handleCreateStandup(formData, selectedDate);
      toast.success('Meeting scheduled successfully!');
    } catch (err) {
      toast.error('Failed to schedule meeting.');
    }
    setIsNewStandupOpen(false);
    setFormData({ title: '', time: '10:00', endTime: '11:00', tag: '#analysis', type: 'general', isActive: false, isPinned: false });
  };

  if (!isAuthenticated) {
    return authMode === 'register' ? (
      <Register onRegister={handleRegister} switchToLogin={() => setAuthMode('login')} />
    ) : (
      <Login onLogin={handleLogin} switchToRegister={() => setAuthMode('register')} />
    );
  }

  return (
    <div className="min-h-screen bg-background text-on-surface font-sans antialiased overflow-x-hidden">
      <LeftSidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} activeTab={activeTab} setActiveTab={setActiveTab} setIsNewStandupOpen={setIsNewStandupOpen} handleLogout={handleLogout} isAnyPopupOpen={isNotificationOpen || isChatOpen || isNewStandupOpen} />

      <TopBar activeTab={activeTab} setActiveTab={setActiveTab} isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} searchQuery={searchQuery} setSearchQuery={setSearchQuery} isNotificationOpen={isNotificationOpen} setIsNotificationOpen={setIsNotificationOpen} isChatOpen={isChatOpen} setIsChatOpen={setIsChatOpen} notifications={notifications} markAllNotificationsAsRead={markAllNotificationsAsRead} chatMessages={chatMessages} newMessage={newMessage} setNewMessage={setNewMessage} handleSendMessage={handleSendMessage} user={authUser} />

      {activeTab === 'Teams' && (
        <Teams isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} groups={groups} dms={dms} activeChatId={activeChatId} setActiveChatId={setActiveChatId} activeChatInfo={activeChatInfo} handleCreateGroup={handleCreateGroup} chatMessagesLog={chatMessagesLog} handleAddReaction={handleAddReaction} chatInputText={chatInputText} setChatInputText={setChatInputText} handleKeyPress={handleKeyPress} handleSendTeamMessage={handleSendTeamMessage} user={authUser} />
      )}
      {activeTab === 'Standups' && (
        <Standups setActiveTab={setActiveTab} isSidebarOpen={isSidebarOpen} handleAddHistoryLog={handleAddHistoryLog} userName={authUser?.name} user={authUser} />
      )}
      {activeTab === 'History' && (
        <History isSidebarOpen={isSidebarOpen} historyLogs={historyLogs} searchQuery={searchQuery} />
      )}
      {activeTab === 'Settings' && (
        <Settings isSidebarOpen={isSidebarOpen} user={authUser} />
      )}
      {!['Teams', 'Standups', 'History', 'Settings'].includes(activeTab) && (
        <Dashboard activeTab={activeTab} setActiveTab={setActiveTab} isSidebarOpen={isSidebarOpen} setIsNewStandupOpen={setIsNewStandupOpen} />
      )}

      <NewStandupModal isOpen={isNewStandupOpen} setIsNewStandupOpen={setIsNewStandupOpen} formData={formData} setFormData={setFormData} handleCreateStandup={onCreateStandup} selectedDate={selectedDate} calendarDays={calendarDays} />

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}

// ─── Root: wrap everything in providers ────────────────────────────────
export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <MeetingsProvider>
          <TeamProvider>
            <ChatProvider>
              <AppShell />
            </ChatProvider>
          </TeamProvider>
        </MeetingsProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
