import { ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon } from '@material-ui/icons';
import React, { FC, memo, useLayoutEffect, useMemo } from 'react';

import { GalleryImage } from './GalleryImage';
import { IconButton } from '@material-ui/core';
import ModuleStyles from './ImageCarousel.module.scss';
import { VirtualImageItem } from '../types/ImageItem';
import clsx from 'clsx';
import { getNeighborIndexes } from 'lib/utils/getNeighborIndexes';
import { noop } from '../utils/noop';

export type ImageCarouselProps = {
  items: VirtualImageItem[];
  previousItem: () => void;
  nextItem: () => void;
  selectedItem: number;
  autoplay?: boolean;
  delay?: number;
};

export const ImageCarousel: FC<ImageCarouselProps> = memo(
  ({ items, previousItem = noop, nextItem = noop, selectedItem, autoplay = false, delay = 2500 }) => {
    const neighbors = useMemo(() => getNeighborIndexes(selectedItem, items.length), [items.length, selectedItem]);

    useLayoutEffect(() => {
      // just return if not using effect
      // for slow loading images, wait until it's loaded before using 1 full tick
      if (!autoplay) {
        return;
      }
      const tick = (): void => {
        if (nextItem) {
          nextItem();
        }
      };
      const interval = window.setInterval(tick, delay);
      return (): void => window.clearInterval(interval);
    }, [autoplay, delay, nextItem]);

    const itemElements = useMemo(() => {
      // handle if we should preload future neighbors

      return items.map((item, index) => {
        if (!item) {
          return null;
        }
        const preload = neighbors.includes(index);
        return (
          <figure
            className={clsx(ModuleStyles.slide, {
              [ModuleStyles.activeSlide]: index === selectedItem,
              [ModuleStyles.inActiveSlide]: index !== selectedItem
            })}
            key={index}>
            {(index === selectedItem || preload) && (
              <GalleryImage {...item.src} src={item.src.url} className={ModuleStyles.image} preload={preload} />
            )}
          </figure>
        );
      });
    }, [items, neighbors, selectedItem]);

    return (
      <div className={ModuleStyles.container}>
        {items.length > 1 && (
          <IconButton color="primary" onClick={previousItem}>
            <ChevronLeftIcon />
          </IconButton>
        )}
        {/* switch these two lines of you want to animate between slides */}
        <div className={ModuleStyles.slides}>{itemElements}</div>
        {items.length > 1 && (
          <IconButton color="primary" onClick={nextItem}>
            <ChevronRightIcon />
          </IconButton>
        )}
      </div>
    );
  }
);
