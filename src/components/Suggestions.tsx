interface SuggestionsProps {
  suggestions: string[];
  onPick: (suggestion: string) => void;
}

export function Suggestions({ suggestions, onPick }: SuggestionsProps) {
  if (suggestions.length === 0) {
    return null;
  }

  return (
    <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-30 overflow-hidden rounded-lg border-4 border-slate-950 bg-white shadow-card">
      {suggestions.map((suggestion) => (
        <button
          key={suggestion}
          type="button"
          onClick={() => onPick(suggestion)}
          className="block w-full bg-white px-4 py-3 text-left text-sm font-extrabold text-slate-800 transition hover:bg-teal-100 focus:bg-teal-100 focus:outline-none"
        >
          {suggestion}
        </button>
      ))}
    </div>
  );
}
