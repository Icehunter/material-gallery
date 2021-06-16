import { ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon } from '@material-ui/icons';
import { ImageItem, MediaType, VirtualMediaItem } from 'lib/types';
import React, { FC, memo, useLayoutEffect, useMemo } from 'react';
import { getNeighborIndexes, noop } from 'lib/utils';

import { IconButton } from '@material-ui/core';
import { ImageTile } from './ImageTile';
import ModuleStyles from './Carousel.module.scss';
import clsx from 'clsx';

export type CarouselProps = {
  items: VirtualMediaItem<unknown>[];
  previousItem: () => void;
  nextItem: () => void;
  selectedItem: number;
  autoplay?: boolean;
  delay?: number;
};

const resolveMediaItems = (
  items: VirtualMediaItem<unknown>[],
  neighbors: number[],
  selectedItem: number
): (JSX.Element | null)[] => {
  return items.map((mediaItem, index) => {
    if (!mediaItem || !mediaItem.item) {
      return null;
    }

    const { item } = mediaItem;

    const preload = neighbors.includes(index);

    let content = null;

    switch (mediaItem.type) {
      case MediaType.Image:
        {
          const imageItem = item as ImageItem;
          content = (
            <ImageTile
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
      default:
        return null;
    }

    return (
      <figure
        className={clsx(ModuleStyles.imageDisplayContainer, {
          [ModuleStyles.selectedImage]: index === selectedItem
        })}
        key={index}>
        {(index === selectedItem || preload) && content}
      </figure>
    );
  });
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
