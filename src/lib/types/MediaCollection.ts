import { MediaItem } from './MediaItem';

export type MediaCollection<T> = {
  items: MediaItem<T>[];
};
