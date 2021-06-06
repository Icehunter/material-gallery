import { FilmStrip, FilmStripProps } from './FilmStrip';
import { ImageCarousel, ImageCarouselProps } from './ImageCarousel';
import React, { FC, memo } from 'react';

import ModuleStyles from './SlideshowGallery.module.scss';

export type SlideshowGalleryProps = ImageCarouselProps & FilmStripProps;

export const SlideshowGallery: FC<SlideshowGalleryProps> = memo(
  ({ items, nextItem, previousItem, selectedItem = 0, setSelectedItem, autoplay, delay }) => {
    return (
      <div className={ModuleStyles.container}>
        <ImageCarousel {...{ items, previousItem, nextItem, selectedItem, autoplay, delay }} />
        {items.length > 1 && <FilmStrip {...{ items, selectedItem, setSelectedItem }} />}
      </div>
    );
  }
);
