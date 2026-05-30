const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export const fetchMeetings = async () => {
  const res = await fetch(`${API_URL}/api/meetings`);
  if (!res.ok) throw new Error('Failed to fetch meetings');
  return res.json();
};

export const createMeeting = async (data) => {
  const res = await fetch(`${API_URL}/api/meetings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create meeting');
  return res.json();
};

export const updateMeeting = async (id, data) => {
  const res = await fetch(`${API_URL}/api/meetings/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update meeting');
  return res.json();
};

export const deleteMeeting = async (id) => {
  const res = await fetch(`${API_URL}/api/meetings/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete meeting');
  return res.json();
};
