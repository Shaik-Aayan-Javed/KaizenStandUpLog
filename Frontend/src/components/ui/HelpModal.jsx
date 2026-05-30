import React, { useEffect } from 'react';
import { X, Keyboard, Lightbulb } from 'lucide-react';

export function HelpModal({ isOpen, onClose }) {
  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-outline-variant overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-outline-variant/60">
          <h2 className="text-lg font-bold text-on-surface">Help & Documentation</h2>
          <button onClick={onClose} className="p-1.5 text-on-surface-variant hover:text-on-surface rounded-lg hover:bg-surface-container transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Keyboard className="w-4 h-4 text-primary" />
              <h3 className="font-semibold text-on-surface text-sm">Keyboard Shortcuts</h3>
            </div>
            <div className="space-y-2 text-sm text-on-surface-variant">
              <div className="flex justify-between items-center bg-surface-container-low p-2 rounded">
                <span>New Standup</span>
                <kbd className="px-2 py-1 bg-white border border-outline-variant rounded shadow-sm text-xs font-mono font-bold">N</kbd>
              </div>
              <div className="flex justify-between items-center bg-surface-container-low p-2 rounded">
                <span>View History</span>
                <kbd className="px-2 py-1 bg-white border border-outline-variant rounded shadow-sm text-xs font-mono font-bold">H</kbd>
              </div>
              <div className="flex justify-between items-center bg-surface-container-low p-2 rounded">
                <span>Close Modal</span>
                <kbd className="px-2 py-1 bg-white border border-outline-variant rounded shadow-sm text-xs font-mono font-bold">Esc</kbd>
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-4 h-4 text-[#ffb020]" />
              <h3 className="font-semibold text-on-surface text-sm">Quick Tips</h3>
            </div>
            <ul className="list-disc pl-5 space-y-1 text-sm text-on-surface-variant">
              <li>Keep standup updates concise and focus on blockers.</li>
              <li>Use the dashboard to track sprint metrics visually.</li>
              <li>Team status is real-time; know who is online.</li>
            </ul>
          </section>
        </div>

        <div className="p-5 border-t border-outline-variant/60 bg-surface-container-lowest flex justify-end">
          <button 
            onClick={onClose}
            className="px-5 py-2 bg-primary text-on-primary font-bold rounded-lg hover:bg-primary-container transition-colors text-sm cursor-pointer"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
