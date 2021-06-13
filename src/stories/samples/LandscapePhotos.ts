import Page1 from './landscape-page-1.json';
import Page10 from './landscape-page-10.json';
import Page2 from './landscape-page-2.json';
import Page3 from './landscape-page-3.json';
import Page4 from './landscape-page-4.json';
import Page5 from './landscape-page-5.json';
import Page6 from './landscape-page-6.json';
import Page7 from './landscape-page-7.json';
import Page8 from './landscape-page-8.json';
import Page9 from './landscape-page-9.json';
import { UnsplashAPIResponse } from 'stories/types/UnsplashAPIResponse';

export const LandscapePhotos: UnsplashAPIResponse[] = [
  ...Page1.results,
  ...Page2.results,
  ...Page3.results,
  ...Page4.results,
  ...Page5.results,
  ...Page6.results,
  ...Page7.results,
  ...Page8.results,
  ...Page9.results,
  ...Page10.results
];
