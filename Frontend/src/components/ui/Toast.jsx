import React from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

const typeConfig = {
  success: {
    icon: CheckCircle,
    className: 'bg-white border-l-4 border-secondary text-on-surface',
    iconClass: 'text-secondary',
  },
  error: {
    icon: XCircle,
    className: 'bg-white border-l-4 border-error text-on-surface',
    iconClass: 'text-error',
  },
  warning: {
    icon: AlertTriangle,
    className: 'bg-white border-l-4 border-tertiary text-on-surface',
    iconClass: 'text-tertiary',
  },
  info: {
    icon: Info,
    className: 'bg-white border-l-4 border-primary text-on-surface',
    iconClass: 'text-primary',
  },
};

function ToastItem({ toast, onRemove }) {
  const config = typeConfig[toast.type] || typeConfig.info;
  const Icon = config.icon;

  return (
    <div
      className={`flex items-start gap-3 px-4 py-3 rounded-xl shadow-lg border border-outline-variant/30 min-w-[280px] max-w-sm animate-in slide-in-from-right-4 duration-300 ${config.className}`}
    >
      <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${config.iconClass}`} />
      <p className="text-sm flex-1 leading-snug">{toast.message}</p>
      <button
        onClick={() => onRemove(toast.id)}
        className="text-outline hover:text-on-surface transition-colors flex-shrink-0 mt-0.5"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

export function ToastContainer({ toasts, onRemove }) {
  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onRemove={onRemove} />
      ))}
    </div>
  );
}
