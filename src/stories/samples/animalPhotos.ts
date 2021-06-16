import Page1 from './animals-page-1.json';
import Page10 from './animals-page-10.json';
import Page2 from './animals-page-2.json';
import Page3 from './animals-page-3.json';
import Page4 from './animals-page-4.json';
import Page5 from './animals-page-5.json';
import Page6 from './animals-page-6.json';
import Page7 from './animals-page-7.json';
import Page8 from './animals-page-8.json';
import Page9 from './animals-page-9.json';
import { UnsplashAPIResponse } from 'stories/types';

export const animalsPhotos: UnsplashAPIResponse[] = [
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
