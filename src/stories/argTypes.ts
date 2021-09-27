import { MasonryGalleryDirection } from 'lib';
import { UnsplashCollectionSource } from './hooks';

export const imageCount = {
  control: { type: 'range', min: 1, max: 300, step: 1 }
};

export const autoplay = {
  type: 'boolean',
  defaultValue: false
};

export const delay = {
  control: {
    type: 'range',
    min: 1000,
    max: 10000,
    step: 300
  },
  defaultValue: 1500
};

export const collectionSource = {
  defaultValue: UnsplashCollectionSource.Landscape,
  control: {
    type: 'select',
    options: Object.keys(UnsplashCollectionSource)
  }
};

export const direction = {
  defaultValue: MasonryGalleryDirection.Vertical,
  control: {
    type: 'select',
    options: Object.keys(MasonryGalleryDirection)
  }
};

export const themePaletteType = {
  defaultValue: 'light',
  control: {
    type: 'select',
    options: ['light', 'dark']
  }
};

export const zoomScale = {
  control: { type: 'range', min: 0, max: 2, step: 0.25 }
};
