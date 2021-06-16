import { ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon } from '@material-ui/icons';
import { Image, Media, MediaItem, MediaType } from 'lib/types';
import React, { FC, memo, useLayoutEffect, useMemo } from 'react';
import { getNeighborIndexes, noop } from 'lib/utils';

import { IconButton } from '@material-ui/core';
import { ImageTile } from './ImageTile';
import ModuleStyles from './Carousel.module.scss';
import clsx from 'clsx';

export type CarouselProps = {
  items: MediaItem<Media>[];
  previousItem: () => void;
  nextItem: () => void;
  selectedItem: number;
  autoplay?: boolean;
  delay?: number;
};

const resolveMediaItems = (
  items: MediaItem<Media>[],
  neighbors: number[],
  selectedItem: number
): (JSX.Element | null)[] => {
  const results = [];

  for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
    const mediaItem = items[itemIndex];
    if (!mediaItem || !mediaItem.item) {
      continue;
    }

    const { item } = mediaItem;

    const preload = neighbors.includes(itemIndex);

    let content = null;

    switch (mediaItem.type) {
      case MediaType.Image:
        {
          const imageItem = item as Image;
          const preload = neighbors.includes(itemIndex);
          content = (
            <ImageTile
              width={imageItem.width}
              height={imageItem.height}
              src={imageItem.src}
              srcSet={imageItem.srcSet}
              styles={{
                image: ModuleStyles.image,
                loader: ModuleStyles.loader
              }}
              preload={preload}
            />
          );
        }
        break;
    }

    if (content !== null) {
      results[results.length] = (
        <figure
          className={clsx(ModuleStyles.imageDisplayContainer, {
            [ModuleStyles.selectedImage]: itemIndex === selectedItem
          })}
          key={itemIndex}>
          {(itemIndex === selectedItem || preload) && content}
        </figure>
      );
    }
  }

  return results;
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

    const elements = useMemo(() => resolveMediaItems(items, neighbors, selectedItem), [items, neighbors, selectedItem]);

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
          <div className={ModuleStyles.imageContainer}>{elements}</div>
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
