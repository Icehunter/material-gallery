import { Carousel, CarouselProps } from '../Carousel';
import { FilmStrip, FilmStripProps } from '../FilmStrip';
import React, { FC, memo } from 'react';

import ModuleStyles from './SlideshowGallery.module.scss';

export type SlideshowGalleryProps = CarouselProps & FilmStripProps;

export const SlideshowGallery: FC<SlideshowGalleryProps> = memo(
  ({ items, nextItem, previousItem, selectedItem = 0, setSelectedItem, autoplay, delay, thumbnailSize }) => {
    const hasItems = items.length > 1;

    return (
      <div className={ModuleStyles.container}>
        <Carousel {...{ items, previousItem, nextItem, selectedItem, autoplay, delay }} />
        {hasItems && <FilmStrip {...{ items, thumbnailSize, selectedItem, setSelectedItem }} />}
      </div>
    );
  }
);
