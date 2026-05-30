import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

/**
 * A styled in-app confirm dialog — replaces window.confirm().
 *
 * Usage:
 *   <ConfirmDialog
 *     isOpen={open}
 *     title="Remove meeting?"
 *     message='This will permanently delete "Daily Sync".'
 *     confirmLabel="Remove"
 *     onConfirm={() => { doDelete(); setOpen(false); }}
 *     onCancel={() => setOpen(false)}
 *     variant="danger"
 *   />
 */
export function ConfirmDialog({ isOpen, title, message, confirmLabel = 'Confirm', onConfirm, onCancel, variant = 'danger' }) {
  if (!isOpen) return null;

  const confirmClass =
    variant === 'danger'
      ? 'bg-error text-on-error hover:bg-error/90'
      : 'bg-primary text-on-primary hover:bg-primary/90';

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-inverse-surface/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl border border-outline-variant shadow-2xl w-full max-w-sm p-6 relative animate-in zoom-in-95 duration-200">
        <button
          onClick={onCancel}
          className="absolute right-4 top-4 p-1 text-outline hover:text-on-surface rounded-md hover:bg-slate-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-3 mb-4">
          <div className="w-9 h-9 rounded-full bg-error/10 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-error" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-on-surface">{title}</h3>
            {message && <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">{message}</p>}
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-xs font-bold border border-outline-variant rounded-lg hover:bg-slate-100 text-on-surface-variant transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors ${confirmClass}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
