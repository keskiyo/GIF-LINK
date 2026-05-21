export type GifMode = 'search' | 'trending' | 'random';

export interface GifItem {
  id: string;
  title: string;
  pageUrl: string;
  gifUrl: string;
  previewUrl: string;
  width: number;
  height: number;
  rating: string;
  uploadedAt: string | null;
  username: string | null;
  sizeBytes: number | null;
  frameCount: number | null;
  views: number | null;
  tags: string[];
}

export interface GiphyImage {
  url: string;
  width: string;
  height: string;
  size?: string;
  frames?: string;
}

export interface GiphyGif {
  id: string;
  title: string;
  url: string;
  rating?: string;
  import_datetime?: string;
  username?: string;
  source_tld?: string;
  source_post_url?: string;
  user?: {
    username?: string;
    display_name?: string;
  };
  images: {
    original: GiphyImage;
    fixed_width?: GiphyImage;
    downsized_medium?: GiphyImage;
    preview_gif?: GiphyImage;
  };
}

export interface GiphyListResponse {
  data: GiphyGif[];
}

export interface GiphyRandomResponse {
  data: GiphyGif;
}

export interface GiphyErrorResponse {
  message?: string;
  meta?: {
    msg?: string;
    status?: number;
  };
}
