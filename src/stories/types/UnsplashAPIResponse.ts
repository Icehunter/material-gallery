import { UnsplashURLObject } from './UnsplashURLObject';
import { UnsplashUser } from './UnsplashUser';

export type UnsplashAPIResponse = {
  id: string;
  created_at: string;
  width: number;
  height: number;
  alt_description: string | null;
  urls: UnsplashURLObject;
  likes: number;
  user: UnsplashUser;
};
