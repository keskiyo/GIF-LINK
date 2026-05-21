import type {
  GifItem,
  GiphyErrorResponse,
  GiphyGif,
  GiphyListResponse,
  GiphyRandomResponse,
} from '../types/gif';

const API_ROOT = 'https://api.giphy.com/v1/gifs';
const COMMONS_API_ROOT = 'https://commons.wikimedia.org/w/api.php';
const API_KEY = import.meta.env.VITE_GIPHY_API_KEY as string | undefined;
export const DEFAULT_GIF_LIMIT = 10;

export const hasGiphyApiKey = () => Boolean(API_KEY && API_KEY !== 'your_giphy_api_key_here');

const assertApiKey = () => {
  if (!hasGiphyApiKey()) {
    throw new Error('Добавьте VITE_GIPHY_API_KEY в .env, чтобы загрузить GIF из GIPHY.');
  }
};

interface CommonsImageInfo {
  url: string;
  thumburl?: string;
  mime?: string;
  width?: number;
  height?: number;
  size?: number;
  timestamp?: string;
  user?: string;
}

interface CommonsPage {
  pageid: number;
  title: string;
  imageinfo?: CommonsImageInfo[];
}

interface CommonsResponse {
  query?: {
    pages?: Record<string, CommonsPage>;
  };
}

interface GiphySuggestionResponse {
  data: Array<{
    name: string;
  }>;
}

const buildTags = (parts: Array<string | null | undefined>) => {
  const stopWords = new Set(['gif', 'by', 'the', 'and', 'with', 'для', 'или']);
  const seen = new Set<string>();

  return parts
    .join(' ')
    .split(/[^a-zа-яё0-9]+/i)
    .map((tag) => tag.trim().toLowerCase())
    .filter((tag) => {
      if (tag.length < 2 || stopWords.has(tag) || seen.has(tag)) {
        return false;
      }

      seen.add(tag);
      return true;
    })
    .slice(0, 12);
};

const getErrorMessage = async (response: Response) => {
  try {
    const payload = (await response.json()) as GiphyErrorResponse;
    return payload.meta?.msg ?? payload.message ?? 'GIPHY вернул ошибку.';
  } catch {
    return 'Не удалось получить ответ от GIPHY.';
  }
};

const request = async <T>(path: string, params: Record<string, string | number> = {}): Promise<T> => {
  assertApiKey();

  const searchParams = new URLSearchParams({
    api_key: API_KEY!,
    lang: 'ru',
    ...Object.fromEntries(Object.entries(params).map(([key, value]) => [key, String(value)])),
  });

  const response = await fetch(`${API_ROOT}/${path}?${searchParams.toString()}`);

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return response.json() as Promise<T>;
};

const commonsRequest = async (
  query: string,
  limit = DEFAULT_GIF_LIMIT,
  offset = 0,
): Promise<CommonsResponse> => {
  const searchParams = new URLSearchParams({
    action: 'query',
    format: 'json',
    origin: '*',
    generator: 'search',
    gsrsearch: `${query} gif`,
    gsrnamespace: '6',
    gsrlimit: String(Math.max(limit * 2, 24)),
    gsroffset: String(offset),
    prop: 'imageinfo',
    iiprop: 'url|mime|size|timestamp|user',
    iiurlwidth: '480',
  });

  const response = await fetch(`${COMMONS_API_ROOT}?${searchParams.toString()}`);

  if (!response.ok) {
    throw new Error('Не удалось получить GIF из интернета.');
  }

  return response.json() as Promise<CommonsResponse>;
};

const mapGif = (gif: GiphyGif): GifItem => {
  const original = gif.images.original;
  const preview = gif.images.fixed_width ?? gif.images.downsized_medium ?? gif.images.preview_gif ?? original;
  const tags = buildTags([gif.title, gif.username, gif.user?.username, gif.source_tld]);

  return {
    id: gif.id,
    title: gif.title || 'GIF без названия',
    pageUrl: gif.url,
    gifUrl: original.url,
    previewUrl: preview.url,
    width: Number(original.width) || 480,
    height: Number(original.height) || 360,
    rating: gif.rating ?? 'unrated',
    uploadedAt: gif.import_datetime && gif.import_datetime !== '0000-00-00 00:00:00' ? gif.import_datetime : null,
    username: gif.user?.display_name ?? gif.user?.username ?? gif.username ?? null,
    sizeBytes: Number(original.size) || null,
    frameCount: Number(original.frames) || null,
    views: null,
    tags,
  };
};

const cleanCommonsTitle = (title: string) =>
  title
    .replace(/^File:/, '')
    .replace(/\.gif$/i, '')
    .replace(/_/g, ' ');

const mapCommonsGif = (page: CommonsPage): GifItem | null => {
  const image = page.imageinfo?.[0];

  if (!image || image.mime !== 'image/gif' || !image.url.toLowerCase().includes('.gif')) {
    return null;
  }

  return {
    id: `commons-${page.pageid}`,
    title: cleanCommonsTitle(page.title),
    pageUrl: `https://commons.wikimedia.org/wiki/${encodeURIComponent(page.title.replace(/ /g, '_'))}`,
    gifUrl: image.url,
    previewUrl: image.url,
    width: image.width ?? 480,
    height: image.height ?? 360,
    rating: 'unrated',
    uploadedAt: image.timestamp ?? null,
    username: image.user ?? 'Wikimedia Commons',
    sizeBytes: image.size ?? null,
    frameCount: null,
    views: null,
    tags: buildTags([page.title, image.user, 'wikimedia']),
  };
};

const searchCommonsGifs = async (query: string, limit = DEFAULT_GIF_LIMIT, offset = 0) => {
  const payload = await commonsRequest(query, limit, offset);
  const pages = Object.values(payload.query?.pages ?? {});

  return pages
    .map(mapCommonsGif)
    .filter((gif): gif is GifItem => Boolean(gif))
    .slice(0, limit);
};

const trendingTerms = [
  'reaction',
  'funny',
  'dance',
  'animation',
  'pixel',
  'cat',
  'meme',
  'retro',
  'wow',
  'loop',
];

export const searchGifs = async (query: string, limit = DEFAULT_GIF_LIMIT, offset = 0) => {
  if (!hasGiphyApiKey()) {
    return searchCommonsGifs(query, limit, offset);
  }

  const payload = await request<GiphyListResponse>('search', {
    q: query,
    limit,
    offset,
    rating: 'pg-13',
  });

  return payload.data.map(mapGif);
};

export const getTrendingGifs = async (
  limit = DEFAULT_GIF_LIMIT,
  offset = 0,
  rating?: string,
) => {
  if (!hasGiphyApiKey()) {
    const batches = await Promise.all(
      trendingTerms
        .slice(0, 4)
        .map((term) => searchCommonsGifs(term, Math.ceil(limit / 2), offset)),
    );
    return batches.flat().slice(0, limit);
  }

  const params: Record<string, string | number> = {
    limit,
    offset,
  };

  if (rating && rating !== 'all') {
    params.rating = rating;
  }

  const payload = await request<GiphyListResponse>('trending', params);

  return payload.data.map(mapGif);
};

export const getLiveSearchSuggestions = async (query: string) => {
  if (!hasGiphyApiKey() || !query.trim()) {
    return [];
  }

  const payload = await request<GiphySuggestionResponse>('search/tags', {
    q: query,
    limit: 5,
  });

  return payload.data.map((suggestion) => suggestion.name);
};

export const getRandomGif = async (tag?: string) => {
  if (!hasGiphyApiKey()) {
    const term = tag || trendingTerms[Math.floor(Math.random() * trendingTerms.length)];
    const gifs = await searchCommonsGifs(term, 24);
    const randomGif = gifs[Math.floor(Math.random() * gifs.length)];
    return randomGif ? [randomGif] : [];
  }

  const payload = await request<GiphyRandomResponse>('random', tag ? { tag } : {});

  return [mapGif(payload.data)];
};
