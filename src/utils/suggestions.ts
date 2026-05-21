const POPULAR_SEARCHES_KEY = 'giphy:popular-searches';

interface StoredSearchQuery {
  query: string;
  count: number;
  lastUsed: number;
}

const normalizeQuery = (query: string) => query.trim().toLowerCase();

const readStoredSearches = (): StoredSearchQuery[] => {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const payload = window.localStorage.getItem(POPULAR_SEARCHES_KEY);
    const searches = payload ? (JSON.parse(payload) as StoredSearchQuery[]) : [];

    return searches.filter(
      (item) =>
        typeof item.query === 'string' &&
        typeof item.count === 'number' &&
        typeof item.lastUsed === 'number',
    );
  } catch {
    return [];
  }
};

const writeStoredSearches = (searches: StoredSearchQuery[]) => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(POPULAR_SEARCHES_KEY, JSON.stringify(searches.slice(0, 80)));
};

export const rememberSearchQuery = (query: string) => {
  const normalized = normalizeQuery(query);

  if (!normalized) {
    return;
  }

  const searches = readStoredSearches();
  const existingSearch = searches.find((item) => item.query === normalized);

  if (existingSearch) {
    existingSearch.count += 1;
    existingSearch.lastUsed = Date.now();
  } else {
    searches.push({
      query: normalized,
      count: 1,
      lastUsed: Date.now(),
    });
  }

  writeStoredSearches(
    searches.sort((left, right) => right.count - left.count || right.lastUsed - left.lastUsed),
  );
};

export const getPopularSearchSuggestions = (query: string, limit = 5) => {
  const normalized = normalizeQuery(query);

  if (!normalized) {
    return readStoredSearches()
      .sort((left, right) => right.count - left.count || right.lastUsed - left.lastUsed)
      .map((item) => item.query)
      .slice(0, limit);
  }

  return readStoredSearches()
    .filter((item) => item.query !== normalized && item.query.includes(normalized))
    .sort((left, right) => {
      const leftStartsWith = left.query.startsWith(normalized) ? 1 : 0;
      const rightStartsWith = right.query.startsWith(normalized) ? 1 : 0;

      return rightStartsWith - leftStartsWith || right.count - left.count || right.lastUsed - left.lastUsed;
    })
    .map((item) => item.query)
    .slice(0, limit);
};

export const mergeSuggestions = (query: string, sources: string[][], limit = 5) => {
  const normalized = normalizeQuery(query);
  const seenSuggestions = new Set<string>();

  return sources
    .flat()
    .map((suggestion) => suggestion.trim())
    .filter((suggestion) => {
      const normalizedSuggestion = normalizeQuery(suggestion);

      if (!normalizedSuggestion || normalizedSuggestion === normalized || seenSuggestions.has(normalizedSuggestion)) {
        return false;
      }

      seenSuggestions.add(normalizedSuggestion);
      return true;
    })
    .slice(0, limit);
};
