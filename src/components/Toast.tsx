import { CheckCircle2 } from 'lucide-react';

interface ToastProps {
  message: string | null;
}

export function Toast({ message }: ToastProps) {
  if (!message) {
    return null;
  }

  return (
    <div className="fixed bottom-5 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-full border-4 border-slate-950 bg-white px-5 py-3 font-black text-slate-950 shadow-card">
      <CheckCircle2 aria-hidden className="text-emerald-500" size={22} />
      {message}
    </div>
  );
}
