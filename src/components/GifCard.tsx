import { Download, Link } from 'lucide-react';
import type { GifItem } from '../types/gif';

interface GifCardProps {
  gif: GifItem;
  onCopy: (gif: GifItem) => void;
  onDownload: (gif: GifItem) => void;
  onOpen: (gif: GifItem) => void;
}

export function GifCard({ gif, onCopy, onDownload, onOpen }: GifCardProps) {
  const rawRatio = gif.width / gif.height;
  const cardRatio = Math.min(Math.max(rawRatio || 1, 0.72), 1.28);

  return (
    <article
      className="group relative mb-4 break-inside-avoid overflow-hidden rounded-lg bg-slate-950 shadow-card transition duration-200 hover:-translate-y-1 hover:shadow-control"
      style={{ aspectRatio: cardRatio }}
    >
      <button
        type="button"
        onClick={() => onOpen(gif)}
        className="block h-full w-full text-left focus:outline-none focus:ring-4 focus:ring-white/60"
        aria-label={`Открыть ${gif.title}`}
      >
        <img
          src={gif.previewUrl}
          alt={gif.title}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
          loading="lazy"
        />
      </button>

      <div className="absolute right-2 top-2 flex translate-y-1 gap-2 opacity-0 transition duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100">
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onCopy(gif);
          }}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-950/86 text-white shadow-control backdrop-blur transition hover:bg-white hover:text-slate-950 focus:outline-none focus:ring-4 focus:ring-white/50"
          title="Копировать ссылку"
          aria-label="Копировать ссылку"
        >
          <Link aria-hidden size={19} strokeWidth={2.7} />
        </button>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onDownload(gif);
          }}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-950/86 text-white shadow-control backdrop-blur transition hover:bg-teal-300 hover:text-slate-950 focus:outline-none focus:ring-4 focus:ring-white/50"
          title="Скачать GIF"
          aria-label="Скачать GIF"
        >
          <Download aria-hidden size={19} strokeWidth={2.7} />
        </button>
      </div>
    </article>
  );
}
