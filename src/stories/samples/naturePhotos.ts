import Page1 from './nature-page-1.json';
import Page10 from './nature-page-10.json';
import Page2 from './nature-page-2.json';
import Page3 from './nature-page-3.json';
import Page4 from './nature-page-4.json';
import Page5 from './nature-page-5.json';
import Page6 from './nature-page-6.json';
import Page7 from './nature-page-7.json';
import Page8 from './nature-page-8.json';
import Page9 from './nature-page-9.json';
import { UnsplashAPIResponse } from 'stories/types';

export const naturePhotos: UnsplashAPIResponse[] = [
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
