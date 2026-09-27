import React from 'react';
import { CheckCircle2, Info, AlertTriangle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Toast() {
  const { toast } = useApp();

  if (!toast) return null;

  const getIcon = () => {
    switch (toast.type) {
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-[#ef4444] shrink-0" />;
      case 'info':
        return <Info className="w-4 h-4 text-[#38bdf8] shrink-0" />;
      case 'success':
      default:
        return <CheckCircle2 className="w-4 h-4 text-[#a3e635] shrink-0" />;
    }
  };

  return (
    <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none animate-in fade-in slide-in-from-bottom-4 duration-200">
      <div className="bg-[#153e25] text-white px-4 py-3 rounded-2xl shadow-xl border border-[#2b6842] flex items-center gap-2.5 max-w-md pointer-events-auto">
        {getIcon()}
        <span className="text-xs font-medium text-[#edf5f0]">{toast.message}</span>
      </div>
    </div>
  );
}
