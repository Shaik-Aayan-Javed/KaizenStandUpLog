const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export const fetchGroups = async () => {
  const res = await fetch(`${API_URL}/api/groups`);
  if (!res.ok) throw new Error('Failed to fetch groups');
  return res.json();
};

export const createGroup = async (data) => {
  const res = await fetch(`${API_URL}/api/groups`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create group');
  return res.json();
};
