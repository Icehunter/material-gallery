import { ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon } from '@material-ui/icons';
import { Image, Media, MediaItem, MediaType } from 'lib/types';
import React, { FC, memo, useLayoutEffect, useMemo, useRef } from 'react';
import { getNeighborIndexes, noop } from 'lib/utils';

import { IconButton } from '@material-ui/core';
import { ImageTile } from './ImageTile';
import ModuleStyles from './Carousel.module.scss';
import clsx from 'clsx';
import { useRect } from 'lib/hooks';

export type CarouselProps = {
  items: MediaItem<Media>[];
  previousItem: () => void;
  nextItem: () => void;
  selectedItem: number;
  autoplay?: boolean;
  delay?: number;
};

const resolveImageTile = (
  item: Image,
  width: number,
  height: number,
  index: number,
  selected: boolean,
  preload: boolean
): JSX.Element => {
  return (
    <figure
      className={clsx(ModuleStyles.imageDisplayContainer, {
        [ModuleStyles.selectedImage]: selected
      })}
      key={index}
      style={{ width, height }}>
      {(selected || preload) && (
        <ImageTile
          width={width}
          height={height}
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
};

const resolveMediaNodes = (
  items: MediaItem<Media>[],
  neighbors: number[],
  selectedItem: number,
  maxWidth: number,
  maxHeight: number
): JSX.Element[] => {
  const results = [];

  for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
    const mediaItem = items[itemIndex];
    if (!mediaItem || !mediaItem.item) {
      continue;
    }

    const preload = neighbors.includes(itemIndex);
    const selected = selectedItem === itemIndex;

    const { item } = mediaItem;

    // resolve height variance, ensure it fits within a bounding box
    const scale = Math.min(maxWidth / item.width, maxHeight / item.height);

    const normalizedWidth = Math.round(item.width * scale);
    const normalizedHeight = Math.round(item.height * scale);

    switch (mediaItem.type) {
      case MediaType.Image:
        results[results.length] = resolveImageTile(
          item as Image,
          normalizedWidth,
          normalizedHeight,
          itemIndex,
          selected,
          preload
        );
        break;
    }
  }

  return results;
};

export const Carousel: FC<CarouselProps> = memo(
  ({ items, previousItem = noop, nextItem = noop, selectedItem, autoplay = false, delay = 2500 }) => {
    const containerNodeRef = useRef<HTMLDivElement | null>(null);

    const rect = useRect(containerNodeRef);

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

    const mediaNodes = useMemo(() => {
      if (!rect || rect.width === 0 || rect.height === 0) {
        return [];
      }
      return resolveMediaNodes(items, neighbors, selectedItem, Math.floor(rect.width), Math.floor(rect.height));
    }, [items, neighbors, rect, selectedItem]);

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
        <div className={ModuleStyles.content} ref={containerNodeRef}>
          <div className={ModuleStyles.imageContainer}>{mediaNodes}</div>
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
