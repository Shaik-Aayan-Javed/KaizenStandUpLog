const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export const fetchHistoryLogs = async () => {
  const res = await fetch(`${API_URL}/api/historylogs`);
  if (!res.ok) throw new Error('Failed to fetch history logs');
  return res.json();
};

export const createHistoryLog = async (data) => {
  const res = await fetch(`${API_URL}/api/historylogs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create history log');
  return res.json();
};
