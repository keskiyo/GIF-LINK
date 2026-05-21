import { Download, ExternalLink, Link, X } from 'lucide-react';
import { useEffect } from 'react';
import type { GifItem } from '../types/gif';

interface GifModalProps {
  gif: GifItem | null;
  onClose: () => void;
  onCopy: (gif: GifItem) => void;
  onDownload: (gif: GifItem) => void;
}

const formatDate = (value: string | null) => {
  if (!value) {
    return 'Недоступно';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Недоступно';
  }

  return new Intl.DateTimeFormat('ru-RU').format(date);
};

const formatBytes = (value: number | null) => {
  if (!value) {
    return 'Недоступно';
  }

  const megabytes = value / 1024 / 1024;
  return `${megabytes.toFixed(megabytes >= 10 ? 0 : 1)} MB`;
};

export function GifModal({ gif, onClose, onCopy, onDownload }: GifModalProps) {
  useEffect(() => {
    if (!gif) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [gif, onClose]);

  if (!gif) {
    return null;
  }

  const infoItems = [
    ['Размеры', `${gif.width} x ${gif.height} px`],
    ['Размер файла', formatBytes(gif.sizeBytes)],
    ['Кадры', gif.frameCount ? String(gif.frameCount) : 'Недоступно'],
    ['Рейтинг', gif.rating.toUpperCase()],
    ['Автор', gif.username ? `@${gif.username}` : 'Недоступно'],
    ['Дата добавления', formatDate(gif.uploadedAt)],
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/72 p-4 backdrop-blur-sm"
      onMouseDown={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={gif.title}
    >
      <section
        className="relative grid max-h-[92vh] w-full max-w-6xl gap-5 overflow-y-auto rounded-lg border-4 border-slate-950 bg-[#101114] p-5 text-white shadow-card lg:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)]"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white hover:text-slate-950 focus:outline-none focus:ring-4 focus:ring-white/30"
          aria-label="Закрыть"
          title="Закрыть"
        >
          <X aria-hidden size={24} strokeWidth={3} />
        </button>

        <div className="space-y-4">
          <div className="relative">
            <img
              src={gif.gifUrl}
              alt={gif.title}
              className="max-h-[68vh] w-full rounded-md bg-slate-950 object-contain"
            />
            <div className="absolute right-3 top-3 flex gap-2">
              <button
                type="button"
                onClick={() => onCopy(gif)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-950/80 text-white shadow-control backdrop-blur transition hover:bg-white hover:text-slate-950 focus:outline-none focus:ring-4 focus:ring-white/30"
                title="Копировать ссылку"
                aria-label="Копировать ссылку"
              >
                <Link aria-hidden size={19} strokeWidth={2.7} />
              </button>
              <button
                type="button"
                onClick={() => onDownload(gif)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-950/80 text-white shadow-control backdrop-blur transition hover:bg-teal-300 hover:text-slate-950 focus:outline-none focus:ring-4 focus:ring-white/30"
                title="Скачать GIF"
                aria-label="Скачать GIF"
              >
                <Download aria-hidden size={19} strokeWidth={2.7} />
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {gif.tags.length > 0 ? (
              gif.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-white/10 px-3 py-1 text-sm font-black text-teal-100"
                >
                  #{tag}
                </span>
              ))
            ) : (
              <span className="rounded-full bg-white/10 px-3 py-1 text-sm font-black text-slate-300">
                #нет-тегов
              </span>
            )}
          </div>
        </div>

        <aside className="space-y-5 pr-0 lg:pr-8">
          <div className="pr-12">
            <h2 className="text-2xl font-black leading-tight text-white">{gif.title}</h2>
            <a
              href={gif.pageUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex items-center gap-2 text-sm font-black text-teal-200 transition hover:text-teal-100"
            >
              Открыть источник
              <ExternalLink aria-hidden size={16} />
            </a>
          </div>

          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {infoItems.map(([label, value]) => (
              <div key={label}>
                <dt className="text-sm font-black uppercase tracking-wide text-slate-500">{label}</dt>
                <dd className="mt-1 text-xl font-black text-white">{value}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </section>
    </div>
  );
}
