import React from 'react';
import { X, Calendar, Pin, Circle } from 'lucide-react';

function NewStandupModal({ isOpen, setIsNewStandupOpen, formData, setFormData, handleCreateStandup, selectedDate, calendarDays }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-inverse-surface/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all duration-200">
      <div className="bg-white w-full max-w-md rounded-2xl border border-outline-variant p-6 shadow-2xl relative">
        <button onClick={() => setIsNewStandupOpen(false)} className="absolute right-4 top-4 text-on-surface-variant hover:text-on-surface p-1 rounded-md hover:bg-slate-100 transition-colors cursor-pointer">
          <X className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <Calendar className="w-4.5 h-4.5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-primary font-headline-md leading-none">Schedule a Task</h3>
            <span className="text-[10px] text-on-surface-variant font-medium block mt-1">
              Adding to {calendarDays.find((d) => d.isoDate === selectedDate.toISOString().split('T')[0])?.labelFull} {selectedDate.getDate()}, {selectedDate.getFullYear()}
            </span>
          </div>
        </div>
        <hr className="border-outline-variant/60 my-4" />
        <form onSubmit={handleCreateStandup} className="space-y-4">
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g. Analysis Planning"
            className="w-full bg-slate-50 border border-outline-variant rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] text-on-surface-variant font-medium block mb-1">Start Time</label>
              <input type="time" required value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })} className="w-full bg-slate-50 border border-outline-variant rounded-lg px-3 py-2 text-xs" />
            </div>
            <div>
              <label className="text-[10px] text-on-surface-variant font-medium block mb-1">End Time</label>
              <input type="time" required value={formData.endTime} onChange={(e) => setFormData({ ...formData, endTime: e.target.value })} className="w-full bg-slate-50 border border-outline-variant rounded-lg px-3 py-2 text-xs" />
            </div>
          </div>
          <select value={formData.tag} onChange={(e) => setFormData({ ...formData, tag: e.target.value })} className="w-full bg-slate-50 border border-outline-variant rounded-lg px-3 py-2 text-xs">
            <option value="#analysis">#analysis</option>
            <option value="#design">#design</option>
            <option value="#development">#development</option>
            <option value="#testing">#testing</option>
          </select>
          <div className="flex gap-3 py-2">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-semibold transition-all ${
                formData.isActive
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-outline-variant text-on-surface hover:bg-slate-100'
              }`}
            >
              <Circle className="w-4 h-4" />
              Active
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, isPinned: !formData.isPinned })}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-semibold transition-all ${
                formData.isPinned
                  ? 'border-tertiary bg-tertiary/5 text-tertiary'
                  : 'border-outline-variant text-on-surface hover:bg-slate-100'
              }`}
            >
              <Pin className="w-4 h-4" />
              Pin
            </button>
          </div>
          <div className="pt-2 flex justify-end gap-2">
            <button type="button" onClick={() => setIsNewStandupOpen(false)} className="px-4 py-2 border border-outline-variant text-xs font-bold rounded-lg hover:bg-slate-100">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-primary text-on-primary text-xs font-bold rounded-lg hover:bg-primary-container">
              Add to Schedule
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewStandupModal;
