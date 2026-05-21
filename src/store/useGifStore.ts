import { create } from 'zustand';
import type { GifMode } from '../types/gif';
import { rememberSearchQuery } from '../utils/suggestions';

const LAST_QUERY_KEY = 'giphy:last-query';

const readLastQuery = () => {
  if (typeof window === 'undefined') {
    return '';
  }

  return window.localStorage.getItem(LAST_QUERY_KEY) ?? '';
};

interface GifStore {
  mode: GifMode;
  query: string;
  lastSubmittedQuery: string;
  randomSeed: number;
  toast: string | null;
  setMode: (mode: GifMode) => void;
  setQuery: (query: string) => void;
  submitQuery: (query: string) => void;
  requestRandom: () => void;
  clearQuery: () => void;
  showToast: (message: string) => void;
  hideToast: () => void;
}

export const useGifStore = create<GifStore>((set) => ({
  mode: 'trending',
  query: readLastQuery(),
  lastSubmittedQuery: readLastQuery(),
  randomSeed: 0,
  toast: null,
  setMode: (mode) => set({ mode }),
  setQuery: (query) => set({ query }),
  submitQuery: (query) => {
    const trimmedQuery = query.trim();

    if (trimmedQuery && typeof window !== 'undefined') {
      window.localStorage.setItem(LAST_QUERY_KEY, trimmedQuery);
      rememberSearchQuery(trimmedQuery);
    }

    set({
      query: trimmedQuery,
      lastSubmittedQuery: trimmedQuery,
      mode: trimmedQuery ? 'search' : 'trending',
    });
  },
  requestRandom: () => set((state) => ({ mode: 'random', randomSeed: state.randomSeed + 1 })),
  clearQuery: () => set({ query: '', lastSubmittedQuery: '' }),
  showToast: (message) => set({ toast: message }),
  hideToast: () => set({ toast: null }),
}));
