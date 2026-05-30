import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchGroups, createGroup } from '../api/groups';
import { fetchChatMessages, sendMessage, addReaction } from '../api/chatMessages';
import { fetchHistoryLogs, createHistoryLog } from '../api/historyLogs';
import { useAuth } from './AuthContext';

const ChatContext = createContext(null);

const mapId = (arr) => arr.map((item) => ({ ...item, id: item._id }));

export function ChatProvider({ children }) {
  const { isAuthenticated, authUser } = useAuth();
  const [groups, setGroups] = useState([]);
  const [dms, setDms] = useState([]);
  const [activeChatId, setActiveChatId] = useState('engineering-core');
  const [chatMessagesLog, setChatMessagesLog] = useState({});
  const [chatInputText, setChatInputText] = useState('');
  const [historyLogs, setHistoryLogs] = useState([]);

  useEffect(() => {
    if (!isAuthenticated) return;
    const load = async () => {
      try {
        const [groupData, chatData, historyData] = await Promise.all([
          fetchGroups(),
          fetchChatMessages(),
          fetchHistoryLogs(),
        ]);

        const groupsWithId = mapId(groupData);
        setGroups(groupsWithId.filter((x) => x.type === 'channel'));
        setDms(groupsWithId.filter((x) => x.type === 'dm'));
        setHistoryLogs(mapId(historyData));

        const chatMap = {};
        chatData.forEach((msg) => {
          if (!chatMap[msg.groupId]) chatMap[msg.groupId] = [];
          chatMap[msg.groupId].push({ ...msg, id: msg._id });
        });
        setChatMessagesLog(chatMap);
      } catch (err) {
        console.error('Failed to fetch chat/history data:', err);
      }
    };
    load();
  }, [isAuthenticated]);

  const handleSendTeamMessage = async () => {
    if (!chatInputText.trim()) return;
    const msgObj = {
      groupId: activeChatId,
      sender: authUser?.name || authUser?.email || 'You',
      avatar: authUser?.avatar || 'https://i.pravatar.cc/150?img=47',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: chatInputText,
    };
    try {
      const saved = await sendMessage(msgObj);
      const finalMsg = { ...saved, id: saved._id };
      setChatMessagesLog((prev) => ({
        ...prev,
        [activeChatId]: [...(prev[activeChatId] || []), finalMsg],
      }));
    } catch (err) {
      console.error('Failed to send message:', err);
    }
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
      const updated = await addReaction(messageId, emoji);
      const updatedMsg = { ...updated, id: updated._id };
      setChatMessagesLog((prev) => ({
        ...prev,
        [activeChatId]: prev[activeChatId].map((msg) => (msg.id === messageId ? updatedMsg : msg)),
      }));
    } catch (err) {
      console.error('Failed to add reaction:', err);
    }
  };

  const handleCreateGroup = async (name) => {
    if (!name) return;
    const cleanName = name.trim().toLowerCase().replace(/\s+/g, '-');
    if (!cleanName) return;
    const newChan = { groupId: cleanName, name: cleanName, type: 'channel', members: 1, desc: 'General project workspace' };
    try {
      const saved = await createGroup(newChan);
      setGroups((prev) => [...prev, { ...saved, id: saved._id }]);
      setChatMessagesLog((prev) => ({ ...prev, [cleanName]: [] }));
      setActiveChatId(cleanName);
    } catch (err) {
      console.error('Failed to create group:', err);
    }
  };

  const handleAddHistoryLog = async (newLog) => {
    try {
      const saved = await createHistoryLog(newLog);
      setHistoryLogs((prev) => [{ ...saved, id: saved._id }, ...prev]);
    } catch (err) {
      console.error('Failed to add history log:', err);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        groups, dms, activeChatId, setActiveChatId,
        chatMessagesLog, chatInputText, setChatInputText,
        historyLogs,
        handleSendTeamMessage, handleKeyPress, handleAddReaction, handleCreateGroup, handleAddHistoryLog,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export const useChat = () => {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChat must be used inside ChatProvider');
  return ctx;
};
