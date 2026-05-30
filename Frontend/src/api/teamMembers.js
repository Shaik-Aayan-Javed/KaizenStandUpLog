const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export const fetchTeamMembers = async () => {
  const res = await fetch(`${API_URL}/api/teammembers`);
  if (!res.ok) throw new Error('Failed to fetch team members');
  return res.json();
};

export const updateTeamMember = async (id, data) => {
  const res = await fetch(`${API_URL}/api/teammembers/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update team member');
  return res.json();
};
