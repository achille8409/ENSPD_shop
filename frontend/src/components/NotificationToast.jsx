import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function NotificationToast() {
  const { toastMessage } = useCart();

  if (!toastMessage) return null;

  const isSuccess = toastMessage.type === 'success';
  const isError = toastMessage.type === 'error';

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-sm animate-in slide-in-from-bottom-5 duration-300">
      <div className={`p-4 rounded-2xl shadow-xl border flex items-center gap-3 ${
        isSuccess 
          ? 'bg-slate-900 text-white border-slate-800' 
          : isError 
            ? 'bg-rose-900 text-white border-rose-800' 
            : 'bg-indigo-900 text-white border-indigo-800'
      }`}>
        {isSuccess ? (
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
        ) : isError ? (
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
        ) : (
          <Info className="w-5 h-5 text-indigo-300 shrink-0" />
        )}
        <p className="text-xs font-semibold flex-1 leading-snug">
          {toastMessage.message}
        </p>
      </div>
    </div>
  );
}
