import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchTeamMembers, updateTeamMember } from '../api/teamMembers';
import { useAuth } from './AuthContext';

const TeamContext = createContext(null);

const statusMap = {
  Active: { color: 'bg-secondary-fixed-dim', text: 'text-secondary' },
  'In Focus': { color: 'bg-primary-fixed-dim', text: 'text-primary' },
  Offline: { color: 'bg-outline-variant', text: 'text-on-surface-variant' },
  Blocked: { color: 'bg-tertiary-fixed-dim', text: 'text-tertiary' },
};

const mapId = (arr) => arr.map((item) => ({ ...item, id: item._id }));

export function TeamProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [teamMembers, setTeamMembers] = useState([]);
  const [activeTeamMemberId, setActiveTeamMemberId] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchTeamMembers()
      .then((data) => setTeamMembers(mapId(data)))
      .catch((err) => console.error('Failed to fetch team members:', err));
  }, [isAuthenticated]);

  const toggleStatus = async (memberId, newStatus) => {
    try {
      const updated = await updateTeamMember(memberId, {
        status: newStatus,
        statusColor: statusMap[newStatus].color,
        textColor: statusMap[newStatus].text,
      });
      setTeamMembers((prev) => prev.map((m) => (m.id === memberId ? { ...updated, id: updated._id } : m)));
    } catch (err) {
      console.error('Failed to update team member status:', err);
    }
    setActiveTeamMemberId(null);
  };

  return (
    <TeamContext.Provider value={{ teamMembers, activeTeamMemberId, setActiveTeamMemberId, toggleStatus }}>
      {children}
    </TeamContext.Provider>
  );
}

export const useTeam = () => {
  const ctx = useContext(TeamContext);
  if (!ctx) throw new Error('useTeam must be used inside TeamProvider');
  return ctx;
};
