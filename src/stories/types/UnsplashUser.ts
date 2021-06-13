import { UnsplashProfileImageLinks } from './UnsplashProfileImageLinks';
import { UnsplashUserLinks } from './UnsplashUserLinks';

export type UnsplashUser = {
  name: string;
  profile_image: UnsplashProfileImageLinks;
  links: UnsplashUserLinks;
};
