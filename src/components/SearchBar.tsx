import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  isLoading: boolean;
  onChange: (value: string) => void;
  onClear: () => void;
  onSubmit: () => void;
  onEmptySubmit: () => void;
}

export function SearchBar({
  value,
  isLoading,
  onChange,
  onClear,
  onSubmit,
  onEmptySubmit,
}: SearchBarProps) {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!value.trim()) {
      onEmptySubmit();
      return;
    }

    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto mt-8 flex w-full max-w-3xl gap-2">
      <label className="sr-only" htmlFor="gif-search">
        Поиск GIF
      </label>
      <div className="flex min-w-0 flex-1 items-center rounded-2xl border-4 border-slate-950 bg-white shadow-control">
        <input
          id="gif-search"
          name="gif-search-query"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Найти GIF..."
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          className="min-h-16 min-w-0 flex-1 rounded-l-xl bg-transparent px-5 text-lg font-bold text-slate-950 outline-none placeholder:text-slate-400"
        />
        <button
          type="button"
          onClick={onClear}
          disabled={!value || isLoading}
          className="mr-2 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-35"
          title="Очистить"
          aria-label="Очистить"
        >
          <X aria-hidden size={21} />
        </button>
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="inline-flex min-h-16 w-16 shrink-0 items-center justify-center rounded-2xl border-4 border-slate-950 bg-amber-300 text-slate-950 shadow-control transition hover:-translate-y-0.5 hover:bg-amber-200 focus:outline-none focus:ring-4 focus:ring-amber-100 disabled:cursor-wait disabled:opacity-60"
        title="Искать"
        aria-label="Искать"
      >
        <Search aria-hidden size={26} strokeWidth={3} />
      </button>
    </form>
  );
}
