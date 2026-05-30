import React, { useState, useEffect, useRef } from 'react';
import CreateGroupModal from '../components/ui/CreateGroupModal';
import {
  Hash,
  PanelLeftOpen,
  UserPlus,
  PlusCircle,
  Search,
  Info,
  MessageSquare,
  CheckCheck,
  Bold,
  Italic,
  Code,
  Link as LinkIcon,
  Smile,
  Send,
  X,
  FileText
} from 'lucide-react';

function Teams({
  isSidebarOpen,
  setIsSidebarOpen,
  groups,
  dms,
  activeChatId,
  setActiveChatId,
  activeChatInfo,
  handleCreateGroup,
  chatMessagesLog,
  handleAddReaction,
  chatInputText,
  setChatInputText,
  handleKeyPress,
  handleSendTeamMessage,
  user
}) {
  const messagesContainerRef = useRef(null);
  const endOfMessagesRef = useRef(null);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [chatSearchQuery, setChatSearchQuery] = useState('');
  const [isInfoDrawerOpen, setIsInfoDrawerOpen] = useState(false);
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [activeChatId, chatMessagesLog, chatInputText]);

  // Handle High Cohesion DM Filtering + Search Filtering
  const displayedMessages = (chatMessagesLog[activeChatId] || []).filter(msg => {
    // 1. Strict DM Restriction
    if (activeChatInfo?.type === 'dm') {
      const allowedSenders = [user?.name, user?.email, 'You', activeChatInfo.name];
      if (!allowedSenders.includes(msg.sender)) return false;
    }
    
    // 2. Chat Search Filtering
    if (chatSearchQuery) {
      if (!msg.text.toLowerCase().includes(chatSearchQuery.toLowerCase())) return false;
    }
    return true;
  });

  return (
    <>
      <CreateGroupModal 
        isOpen={isCreateGroupModalOpen} 
        onClose={() => setIsCreateGroupModalOpen(false)} 
        onSubmit={handleCreateGroup} 
      />
      <main
        className={`flex h-screen overflow-hidden transition-all duration-300 ease-in-out ${
        isSidebarOpen ? 'ml-64' : 'ml-0'
      }`}
    >
      <section className="w-[320px] bg-surface-container-low/50 border-r border-outline-variant flex flex-col h-full flex-shrink-0 z-20">
        <div className="h-16 flex items-center px-6 justify-between flex-shrink-0 border-b border-outline-variant/30">
          <div className="flex items-center gap-2">
            {!isSidebarOpen && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-1 text-on-surface-variant hover:text-primary rounded-lg hover:bg-surface-container-highest transition-colors cursor-pointer"
                title="Expand Sidebar"
              >
                <PanelLeftOpen className="w-4.5 h-4.5" />
              </button>
            )}
            <h2 className="text-lg font-bold text-on-surface font-headline-md leading-none">Teams</h2>
          </div>
          <button
            onClick={() => setIsCreateGroupModalOpen(true)}
            className="p-1 hover:bg-surface-container rounded-full text-primary transition-all cursor-pointer"
            title="Add Group"
          >
            <UserPlus className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-hide">
          <div>
            <div className="px-3 mb-2 flex items-center justify-between text-on-surface-variant/60">
              <span className="text-[10px] font-sans uppercase tracking-widest font-semibold">Joined Groups</span>
            </div>
            <ul className="space-y-0.5">
              {groups.map((group) => {
                const isActive = activeChatId === group.groupId;
                return (
                  <li key={group.id}>
                    <button
                      onClick={() => setActiveChatId(group.groupId)}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-left text-sm cursor-pointer ${
                        isActive
                          ? 'bg-primary-container text-on-primary-container font-semibold'
                          : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                      }`}
                    >
                      <Hash className={`w-4 h-4 ${isActive ? 'text-on-primary-container/70' : 'text-outline-variant'}`} />
                      <span className="truncate">{group.name}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <div className="px-3 mb-2 text-on-surface-variant/60">
              <span className="text-[10px] font-sans uppercase tracking-widest font-semibold">Direct Messages</span>
            </div>
            <ul className="space-y-0.5">
              {dms.map((dm) => {
                const isActive = activeChatId === dm.groupId;
                return (
                  <li key={dm.id}>
                    <button
                      onClick={() => setActiveChatId(dm.groupId)}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-left text-sm cursor-pointer ${
                        isActive
                          ? 'bg-primary-container text-on-primary-container font-semibold'
                          : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                      }`}
                    >
                      <div className="relative flex-shrink-0">
                        <img alt={dm.name} className="w-6 h-6 rounded-full border border-slate-100" src={dm.avatar} />
                        <div className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-white ${
                          dm.status === 'Active' ? 'bg-secondary' : 'bg-outline-variant'
                        }`}></div>
                      </div>
                      <span className="truncate">{dm.name}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="p-4 flex-shrink-0 border-t border-outline-variant/30 bg-surface-container-low/20">
          <button
            onClick={() => setIsCreateGroupModalOpen(true)}
            className="w-full border border-outline-variant text-on-surface-variant font-bold text-xs py-2 rounded-lg hover:bg-surface-container hover:text-on-surface transition-all flex items-center justify-center gap-1 cursor-pointer active:scale-98"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Group</span>
          </button>
        </div>
      </section>

      <section className="flex-1 flex flex-col bg-white overflow-hidden h-full relative">
        <header className="h-16 flex items-center justify-between px-6 border-b border-outline-variant/30 bg-white/80 backdrop-blur-sm flex-shrink-0 sticky top-0 z-10">
          <div className="flex items-center gap-2 min-w-0">
            {activeChatInfo.type === 'channel' ? (
              <Hash className="w-5 h-5 text-primary flex-shrink-0" />
            ) : (
              <div className="relative w-6 h-6 flex-shrink-0">
                <img alt="" className="w-6 h-6 rounded-full" src={activeChatInfo.avatar} />
                <div className={`absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 rounded-full border border-white ${
                  activeChatInfo.status === 'Active' ? 'bg-secondary' : 'bg-outline-variant'
                }`}></div>
              </div>
            )}
            <div className="min-w-0">
              <h2 className="text-sm font-bold text-on-surface truncate leading-none">{activeChatInfo.name}</h2>
              <p className="text-[10px] text-on-surface-variant/60 mt-1 truncate">
                {activeChatInfo.type === 'channel'
                  ? `${activeChatInfo.members} members • ${activeChatInfo.desc}`
                  : activeChatInfo.desc}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            {isSearchOpen ? (
              <div className="flex items-center bg-surface-container-low border border-outline-variant/50 rounded-lg px-2 py-1 mr-2 animate-in fade-in slide-in-from-right-4 duration-200">
                <Search className="w-4 h-4 text-on-surface-variant mr-1" />
                <input 
                  autoFocus
                  type="text"
                  placeholder="Search chat..."
                  value={chatSearchQuery}
                  onChange={e => setChatSearchQuery(e.target.value)}
                  className="bg-transparent border-none focus:outline-none focus:ring-0 text-xs text-on-surface w-40"
                />
                <button onClick={() => { setIsSearchOpen(false); setChatSearchQuery(''); }} className="text-on-surface-variant hover:text-on-surface">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button onClick={() => setIsSearchOpen(true)} className="p-1.5 hover:bg-surface-container rounded-full text-on-surface-variant transition-all cursor-pointer">
                <Search className="w-4.5 h-4.5" />
              </button>
            )}
            <button onClick={() => setIsInfoDrawerOpen(!isInfoDrawerOpen)} className={`p-1.5 rounded-full transition-all cursor-pointer ${isInfoDrawerOpen ? 'bg-primary/10 text-primary' : 'hover:bg-surface-container text-on-surface-variant'}`}>
              <Info className="w-4.5 h-4.5" />
            </button>
          </div>
        </header>

        {/* Info Drawer */}
        {isInfoDrawerOpen && (
           <div className="absolute top-16 right-0 bottom-16 w-80 bg-white border-l border-outline-variant/30 shadow-xl z-20 animate-in slide-in-from-right-full duration-300 flex flex-col">
              <div className="p-6 border-b border-outline-variant/30 flex flex-col items-center text-center">
                {activeChatInfo.type === 'channel' ? (
                  <div className="w-20 h-20 rounded-2xl bg-primary-container text-on-primary-container flex items-center justify-center mb-4">
                    <Hash className="w-10 h-10" />
                  </div>
                ) : (
                  <img src={activeChatInfo.avatar} alt={activeChatInfo.name} className="w-20 h-20 rounded-full border-4 border-white shadow-md mb-4" />
                )}
                <h3 className="text-xl font-bold text-on-surface">{activeChatInfo.type === 'channel' ? `#${activeChatInfo.name}` : activeChatInfo.name}</h3>
                <p className="text-sm text-on-surface-variant mt-2 leading-relaxed">{activeChatInfo.desc}</p>
              </div>
              <div className="p-6 flex-1 overflow-y-auto space-y-6">
                 {activeChatInfo.type === 'channel' && (
                   <div>
                     <h4 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-3">Members ({activeChatInfo.members})</h4>
                     <div className="flex -space-x-2">
                       <img className="w-8 h-8 rounded-full border-2 border-white" src="https://i.pravatar.cc/150?img=47" alt="Member" />
                       <img className="w-8 h-8 rounded-full border-2 border-white" src="https://i.pravatar.cc/150?img=12" alt="Member" />
                       <img className="w-8 h-8 rounded-full border-2 border-white" src="https://i.pravatar.cc/150?img=33" alt="Member" />
                       <div className="w-8 h-8 rounded-full border-2 border-white bg-surface-container-highest flex items-center justify-center text-[10px] font-bold text-on-surface-variant">+{activeChatInfo.members - 3}</div>
                     </div>
                   </div>
                 )}
                 <div>
                    <h4 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-3">Shared Files</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-container-lowest transition-colors cursor-pointer border border-outline-variant/30">
                        <div className="p-2 bg-[#d5ecd4]/30 rounded text-[#4a7251]"><FileText className="w-4 h-4" /></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-on-surface truncate">Q3_Requirements.pdf</p>
                          <p className="text-[10px] text-on-surface-variant">Shared yesterday</p>
                        </div>
                      </div>
                    </div>
                 </div>
              </div>
           </div>
        )}

        <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide bg-slate-50/20">
          <div className="flex items-center gap-4 py-2">
            <div className="flex-1 h-px bg-outline-variant opacity-25"></div>
            <span className="text-[10px] text-on-surface-variant/50 font-semibold">Today, October 24</span>
            <div className="flex-1 h-px bg-outline-variant opacity-25"></div>
          </div>
          {displayedMessages.length === 0 ? (
            <div className="py-20 text-center flex flex-col items-center justify-center">
              <MessageSquare className="w-12 h-12 text-outline-variant/60 mb-2.5" />
              <h4 className="text-sm font-bold text-on-surface">
                {chatSearchQuery ? 'No messages match your search' : 'No messages here yet'}
              </h4>
            </div>
          ) : (
            displayedMessages.map((msg) => {
              const isCurrentUser = msg.sender === user?.name || msg.sender === user?.email || msg.sender === 'You';
              const avatarToUse = isCurrentUser ? (user?.avatar || msg.avatar) : msg.avatar;
              const isImage = typeof avatarToUse === 'string' && (avatarToUse.startsWith('http') || avatarToUse.startsWith('data:image'));
              
              const avatarElement = isImage ? (
                <img className="w-9 h-9 flex-shrink-0 rounded-full bg-secondary-container object-cover border border-slate-100" src={avatarToUse} alt="" />
              ) : (
                <div className="w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-full bg-primary-container text-on-primary-container font-bold text-xs">
                  {msg.sender.slice(0, 2).toUpperCase()}
                </div>
              );

              return (
                <div key={msg.id} className={`flex w-full gap-3 group items-end animate-in fade-in-50 duration-150 ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}>
                  {!isCurrentUser && avatarElement}
                  
                  <div className={`flex flex-col space-y-1 min-w-0 max-w-[75%] ${isCurrentUser ? 'items-end' : 'items-start'}`}>
                    <div className={`flex items-center gap-2 ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}>
                      <span className="text-xs font-bold text-on-surface">{isCurrentUser ? 'You' : msg.sender}</span>
                      <span className="text-[9px] text-on-surface-variant/40">{msg.time}</span>
                    </div>
                    
                    <div className={`text-sm leading-relaxed px-4 py-2.5 shadow-sm ${
                      isCurrentUser 
                        ? 'bg-primary text-on-primary rounded-2xl rounded-br-sm' 
                        : 'bg-white text-on-surface rounded-2xl rounded-bl-sm border border-outline-variant/30'
                    }`}>
                      {msg.text}
                    </div>
                    
                    <div className={`flex gap-1.5 pt-0.5 items-center flex-wrap ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}>
                      {msg.reactions && Object.entries(msg.reactions).map(([emoji, count]) => (
                        <button key={emoji} onClick={() => handleAddReaction(msg.id, emoji)} className="flex items-center gap-1 px-2 py-0.5 bg-secondary-container/30 border border-secondary-container rounded-full text-[10px] cursor-pointer hover:bg-secondary-container/50 transition-colors">
                          <span>{emoji}</span>
                          <span>{count}</span>
                        </button>
                      ))}
                      <button onClick={() => handleAddReaction(msg.id, '🚀')} className="opacity-0 group-hover:opacity-100 w-5 h-5 rounded-full border border-outline-variant/40 cursor-pointer text-[10px] flex items-center justify-center hover:bg-slate-50 transition-colors">🚀</button>
                      <button onClick={() => handleAddReaction(msg.id, '👀')} className="opacity-0 group-hover:opacity-100 w-5 h-5 rounded-full border border-outline-variant/40 cursor-pointer text-[10px] flex items-center justify-center hover:bg-slate-50 transition-colors">👀</button>
                    </div>
                    
                    {msg.read && isCurrentUser && (
                      <div className="flex items-center gap-1 text-[9px] text-primary mt-1 select-none">
                        <CheckCheck className="w-3.5 h-3.5 text-primary" />
                        <span>Read</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
          <div ref={endOfMessagesRef} />
        </div>

        <div className="p-4 bg-white border-t border-outline-variant/30 flex-shrink-0 z-10">
          <div className="bg-surface-container-low border border-outline-variant/50 rounded-xl p-1">
            <div className="flex items-center gap-1 px-1 border-b border-outline-variant/10 pb-1 mb-1">
              <button className="p-1 text-on-surface-variant/60"><Bold className="w-4 h-4" /></button>
              <button className="p-1 text-on-surface-variant/60"><Italic className="w-4 h-4" /></button>
              <button className="p-1 text-on-surface-variant/60"><Code className="w-4 h-4" /></button>
              <div className="w-px h-3 bg-outline-variant/30 mx-1"></div>
              <button className="p-1 text-on-surface-variant/60"><LinkIcon className="w-4 h-4" /></button>
            </div>
            <div className="flex items-end gap-3 px-2 pb-1.5 pt-0.5">
              <textarea
                value={chatInputText}
                onChange={(e) => setChatInputText(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={`Message ${activeChatInfo.type === 'channel' ? '#' : ''}${activeChatInfo.name}`}
                rows={1}
                className="flex-grow bg-transparent border-none focus:ring-0 text-xs py-1.5 resize-none outline-none"
              />
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button type="button" onClick={() => setChatInputText((prev) => prev + ' 🚀')} className="p-1.5 text-on-surface-variant/60 rounded-full cursor-pointer hover:bg-surface-container">
                  <Smile className="w-4.5 h-4.5" />
                </button>
                <button onClick={() => handleSendTeamMessage()} disabled={!chatInputText.trim()} className="p-1.5 bg-primary text-on-primary rounded-lg disabled:opacity-40 cursor-pointer hover:bg-primary-container">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
    </>
  );
}

export default Teams;
