import { AlertTriangle, Copy, Download, RefreshCw, StepForward } from 'lucide-react';
import { getLocalizedErrorMessage, type LanguageCode, messages } from '../i18n';
import type { GifItem } from '../types/gif';

interface RandomGifPanelProps {
  gif: GifItem | null;
  language: LanguageCode;
  isLoading: boolean;
  error: Error | null;
  onNext: () => void;
  onRetry: () => void;
  onCopy: (gif: GifItem) => void;
  onDownload: (gif: GifItem) => void;
}

export function RandomGifPanel({
  gif,
  language,
  isLoading,
  error,
  onNext,
  onRetry,
  onCopy,
  onDownload,
}: RandomGifPanelProps) {
  const t = messages[language];

  if (isLoading) {
    return (
      <section className="mx-auto mt-10 flex min-h-96 max-w-5xl items-center justify-center">
        <img
          src="/DANCE_CAT.gif"
          alt={t.states.loadingGif}
          className="w-full max-w-sm object-contain"
        />
      </section>
    );
  }

  if (error) {
    return (
      <section className="mx-auto mt-10 max-w-xl rounded-lg border-4 border-slate-950 bg-white p-8 text-center shadow-card">
        <AlertTriangle aria-hidden className="mx-auto mb-4 text-rose-500" size={42} />
        <h2 className="animated-text-gradient animated-text-gradient-status text-2xl font-black">{t.states.loadError}</h2>
        <p className="mt-2 text-sm font-semibold text-slate-600">{getLocalizedErrorMessage(language, error.message)}</p>
        <button
          type="button"
          onClick={onRetry}
          className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-slate-950 px-5 font-black uppercase tracking-wide text-white transition hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-200"
        >
          <RefreshCw aria-hidden size={18} />
          {t.actions.retry}
        </button>
      </section>
    );
  }

  if (!gif) {
    return (
      <section className="mx-auto mt-10 max-w-xl rounded-lg border-4 border-slate-950 bg-white/82 p-8 text-center shadow-card">
        <h2 className="animated-text-gradient animated-text-gradient-status text-2xl font-black">{t.states.gifNotFound}</h2>
        <button
          type="button"
          onClick={onNext}
          className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-slate-950 px-5 font-black uppercase tracking-wide text-white transition hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-200"
        >
          <StepForward aria-hidden size={18} />
          {t.random.more}
        </button>
      </section>
    );
  }

  return (
    <section className="mx-auto mt-10 max-w-5xl">
      <a
        href={gif.pageUrl}
        target="_blank"
        rel="noreferrer"
        className="block overflow-hidden rounded-lg border-4 border-slate-950 bg-slate-950 shadow-card"
      >
        <img
          src={gif.gifUrl}
          alt={gif.title}
          className="aspect-video w-full object-contain"
          loading="eager"
        />
      </a>

      <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={onNext}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-amber-300 px-5 font-black uppercase tracking-wide text-slate-950 shadow-control transition hover:-translate-y-0.5 hover:bg-amber-200 focus:outline-none focus:ring-4 focus:ring-amber-100"
        >
          <StepForward aria-hidden size={20} />
          {t.random.next}
        </button>
        <button
          type="button"
          onClick={() => onCopy(gif)}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-slate-950 px-5 font-black uppercase tracking-wide text-white shadow-control transition hover:-translate-y-0.5 hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-200"
        >
          <Copy aria-hidden size={18} />
          {t.random.link}
        </button>
        <button
          type="button"
          onClick={() => onDownload(gif)}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-teal-300 px-5 font-black uppercase tracking-wide text-slate-950 shadow-control transition hover:-translate-y-0.5 hover:bg-teal-200 focus:outline-none focus:ring-4 focus:ring-teal-100"
        >
          <Download aria-hidden size={18} />
          {t.random.download}
        </button>
      </div>
    </section>
  );
}
