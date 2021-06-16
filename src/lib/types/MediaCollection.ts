import { VirtualMediaItem } from './MediaItem';

export type MediaCollection<T> = {
  items: VirtualMediaItem<T>[];
};

export type VirtualMediaCollection<T> = MediaCollection<T> | undefined;
