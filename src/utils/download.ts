import type { GifItem } from '../types/gif';

const sanitizeFileName = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-zа-яё0-9]+/gi, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64);

export const downloadGif = async (gif: GifItem, fallbackName: string) => {
  const response = await fetch(gif.gifUrl);

  if (!response.ok) {
    throw new Error('Не удалось скачать GIF.');
  }

  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  const fileName = sanitizeFileName(gif.title || fallbackName || 'giphy');

  anchor.href = objectUrl;
  anchor.download = `${fileName || 'giphy'}.gif`;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(objectUrl);
};
