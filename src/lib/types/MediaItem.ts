import { MediaType } from './MediaType';

export type MediaItem<T> = {
  type: MediaType;
  item: T;
};
