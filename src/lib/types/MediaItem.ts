import { MediaType } from './MediaType';

export type MediaItem<T> = {
  type: MediaType;
  item: T;
};

export type VirtualMediaItem<T> = MediaItem<T> | undefined;
