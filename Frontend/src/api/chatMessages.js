const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export const fetchChatMessages = async () => {
  const res = await fetch(`${API_URL}/api/chatmessages`);
  if (!res.ok) throw new Error('Failed to fetch chat messages');
  return res.json();
};

export const sendMessage = async (data) => {
  const res = await fetch(`${API_URL}/api/chatmessages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to send message');
  return res.json();
};

export const addReaction = async (messageId, emoji) => {
  const res = await fetch(`${API_URL}/api/chatmessages/${messageId}/react`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ emoji }),
  });
  if (!res.ok) throw new Error('Failed to add reaction');
  return res.json();
};
