import React from 'react';
import { Search, X, Bell, MessageSquare, PanelLeftOpen } from 'lucide-react';

function TopBar({
  activeTab,
  isSidebarOpen,
  setIsSidebarOpen,
  searchQuery,
  setSearchQuery,
  isNotificationOpen,
  setIsNotificationOpen,
  isChatOpen,
  setIsChatOpen,
  notifications,
  markAllNotificationsAsRead,
  chatMessages,
  newMessage,
  setNewMessage,
  handleSendMessage,
  user
}) {
  if (activeTab === 'Teams') return null;

  return (
    <header className={`flex justify-between items-center px-8 h-16 bg-background/80 backdrop-blur-md sticky top-0 z-20 border-b border-outline-variant transition-all duration-300 ease-in-out ${isSidebarOpen ? 'ml-64 w-[calc(100%-16rem)]' : 'ml-0 w-full'}`}>
      <div className="flex items-center flex-grow max-w-xl gap-3">
        {!isSidebarOpen && (
          <button onClick={() => setIsSidebarOpen(true)} className="p-1.5 text-on-surface-variant hover:text-primary rounded-lg hover:bg-surface-container-highest transition-colors flex-shrink-0 cursor-pointer" title="Expand Sidebar">
            <PanelLeftOpen className="w-5 h-5" />
          </button>
        )}
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant w-4.5 h-4.5" />
          <input 
            type="text" 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
            className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg pl-10 pr-4 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary" 
            placeholder={activeTab === 'History' ? 'Search team logs...' : activeTab === 'Standups' ? 'Search standups...' : 'Search workspace...'} 
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface cursor-pointer">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <button onClick={() => { setIsNotificationOpen(!isNotificationOpen); setIsChatOpen(false); }} className={`relative p-2 rounded-lg cursor-pointer ${isNotificationOpen ? 'text-primary' : 'text-on-surface-variant'}`}>
            <Bell className="w-5 h-5" />
            {notifications.some((n) => !n.read) && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full ring-2 ring-background"></span>}
          </button>
          {isNotificationOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-outline-variant z-50 p-4">
              <div className="flex justify-between items-center border-b border-outline-variant/60 pb-2 mb-3">
                <h5 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Notifications</h5>
                <button onClick={markAllNotificationsAsRead} className="text-[10px] text-primary font-bold hover:underline">Mark all read</button>
              </div>
              <div className="space-y-3 max-h-60 overflow-y-auto scrollbar-hide">
                {notifications.map((n) => (
                  <div key={n.id} className={`p-2 rounded-lg text-xs ${n.read ? 'text-on-surface-variant' : 'bg-surface-container-high/40 text-on-surface font-medium border-l-2 border-primary'}`}>
                    <p>{n.text}</p>
                    <span className="text-[10px] text-outline mt-1 block">{n.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="relative">
          <button onClick={() => { setIsChatOpen(!isChatOpen); setIsNotificationOpen(false); }} className={`p-2 rounded-lg cursor-pointer ${isChatOpen ? 'text-primary' : 'text-on-surface-variant'}`}>
            <MessageSquare className="w-5 h-5" />
          </button>
          {isChatOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-outline-variant z-50 flex flex-col h-[380px]">
              <div className="flex-grow p-3 overflow-y-auto space-y-2 bg-slate-50/50">
                {chatMessages.map((msg) => (
                  <div key={msg.id} className={`max-w-[85%] rounded-lg p-2 text-xs ${msg.sender === 'You' ? 'bg-primary text-on-primary ml-auto' : 'bg-surface-container-highest text-on-surface mr-auto'}`}>
                    <p>{msg.text}</p>
                    <span className="text-[8px] mt-1 block text-right">{msg.time}</span>
                  </div>
                ))}
              </div>
              <form onSubmit={handleSendMessage} className="p-2 border-t border-outline-variant flex gap-1">
                <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type a message..." className="flex-grow bg-surface-container-low border border-outline-variant rounded-lg px-3 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary" />
              </form>
            </div>
          )}
        </div>

        <img
          onClick={() => alert('Profile clicked')}
          src={user?.avatar || 'https://i.pravatar.cc/150?img=47'}
          alt={user?.name || 'Kaizen User'}
          className="w-9 h-9 rounded-full border border-outline-variant/60 cursor-pointer shadow-sm hover:ring-2 hover:ring-primary/30 transition-all"
        />
      </div>
    </header>
  );
}

export default TopBar;
