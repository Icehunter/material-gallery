import { ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon } from '@material-ui/icons';
import React, { FC, memo, useLayoutEffect, useMemo } from 'react';

import { GalleryImage } from './GalleryImage';
import { IconButton } from '@material-ui/core';
import ModuleStyles from './Carousel.module.scss';
import { VirtualImageItem } from '../types/ImageItem';
import clsx from 'clsx';
import { getNeighborIndexes } from 'lib/utils/getNeighborIndexes';
import { noop } from '../utils/noop';

export type CarouselProps = {
  items: VirtualImageItem[];
  previousItem: () => void;
  nextItem: () => void;
  selectedItem: number;
  autoplay?: boolean;
  delay?: number;
};

export const Carousel: FC<CarouselProps> = memo(
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
            className={clsx(ModuleStyles.imageDisplayContainer, {
              [ModuleStyles.selectedImage]: index === selectedItem
            })}
            key={index}>
            {(index === selectedItem || preload) && (
              <GalleryImage
                src={item.src}
                srcSet={item.srcSet}
                styles={{
                  image: ModuleStyles.image,
                  loader: ModuleStyles.loader
                }}
                preload={preload}
              />
            )}
          </figure>
        );
      });
    }, [items, neighbors, selectedItem]);

    return (
      <div className={ModuleStyles.container}>
        <div className={ModuleStyles.navigation}>
          <IconButton
            color="primary"
            className={clsx(ModuleStyles.icon, {
              [ModuleStyles.iconVisible]: items.length > 1
            })}
            onClick={previousItem}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <div className={ModuleStyles.content}>
          <div className={ModuleStyles.imageContainer}>{itemElements}</div>
        </div>
        <div className={ModuleStyles.navigation}>
          <IconButton
            color="primary"
            className={clsx(ModuleStyles.icon, {
              [ModuleStyles.iconVisible]: items.length > 1
            })}
            onClick={nextItem}>
            <ChevronRightIcon />
          </IconButton>
        </div>
      </div>
    );
  }
);
