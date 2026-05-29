import React from 'react';
import {
  LayoutDashboard,
  Users,
  Timer,
  History,
  Settings,
  PlusCircle,
  HelpCircle,
  LogOut,
  PanelLeftClose
} from 'lucide-react';

function LeftSidebar({ isSidebarOpen, setIsSidebarOpen, activeTab, setActiveTab, setIsNewStandupOpen, handleLogout }) {
  return (
    <aside
      className={`flex flex-col h-full py-6 px-4 bg-surface-container-low dark:bg-inverse-surface fixed left-0 top-0 border-r border-outline-variant z-30 transition-all duration-300 ease-in-out ${
        isSidebarOpen ? 'w-64 opacity-100 translate-x-0' : 'w-0 opacity-0 -translate-x-full pointer-events-none'
      }`}
    >
      <div className="mb-10 px-3 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-primary">Kaizen</h1>
          <p className="text-xs text-on-surface-variant font-medium mt-0.5">Workspace</p>
        </div>
        <button onClick={() => setIsSidebarOpen(false)} className="p-1 text-on-surface-variant hover:text-primary rounded-lg hover:bg-surface-container-highest/60 transition-colors cursor-pointer" title="Collapse Sidebar">
          <PanelLeftClose className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-grow space-y-1">
        {[
          { name: 'Dashboard', icon: LayoutDashboard },
          { name: 'Teams', icon: Users },
          { name: 'Standups', icon: Timer },
          { name: 'History', icon: History },
          { name: 'Settings', icon: Settings }
        ].map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.name;
          return (
            <button
              key={item.name}
              onClick={() => setActiveTab(item.name)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 cursor-pointer ${
                isActive
                  ? 'text-primary font-bold border-r-2 border-primary bg-surface-container-highest'
                  : 'text-on-surface-variant hover:bg-surface-container-highest/60 hover:text-on-surface'
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span>{item.name}</span>
            </button>
          );
        })}
      </nav>

      <div className="mt-auto space-y-4 pt-4 border-t border-outline-variant/60">
        <button onClick={() => setActiveTab('Standups')} className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary text-on-primary rounded-xl font-bold hover:bg-primary-container transition-all shadow-sm active:scale-95 duration-150 text-sm cursor-pointer">
          <PlusCircle className="w-4 h-4" />
          <span>New Standup</span>
        </button>
        <div className="space-y-0.5">
          <a href="#" onClick={(e) => { e.preventDefault(); alert('Help & Documentation coming soon!'); }} className="flex items-center gap-3 px-3 py-2 text-sm text-on-surface-variant hover:bg-surface-container-highest rounded-lg transition-colors">
            <HelpCircle className="w-4.5 h-4.5" />
            <span>Help</span>
          </a>
          <a href="#" onClick={(e) => { e.preventDefault(); handleLogout(); }} className="flex items-center gap-3 px-3 py-2 text-sm text-on-surface-variant hover:bg-surface-container-highest rounded-lg transition-colors">
            <LogOut className="w-4.5 h-4.5" />
            <span>Logout</span>
          </a>
        </div>
      </div>
    </aside>
  );
}

export default LeftSidebar;
