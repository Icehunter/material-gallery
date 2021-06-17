import { ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon } from '@material-ui/icons';
import { Image, Media, MediaItem, MediaType } from 'lib/types';
import React, { Dispatch, FC, SetStateAction, memo, useLayoutEffect, useMemo, useRef } from 'react';

import { IconButton } from '@material-ui/core';
import ModuleStyles from './FilmStrip.module.scss';
import { Thumbnail } from './Thumbnail';
import clsx from 'clsx';
import { getNeighborIndexes } from 'lib/utils';
import { useHorizontalScrollPosition } from 'lib/hooks';

export type FilmStripProps = {
  items: MediaItem<Media>[];
  thumbnailSize?: number;
  selectedItem: number;
  setSelectedItem: Dispatch<SetStateAction<number>>;
};

const resolveMediaItems = (
  items: MediaItem<Media>[],
  neighbors: number[],
  selectedItem: number,
  setSelectedItem: Dispatch<SetStateAction<number>>,
  thumbnailSize?: number
): JSX.Element[] => {
  const results = [];

  for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
    const mediaItem = items[itemIndex];
    if (!mediaItem || !mediaItem.item) {
      continue;
    }

    const preload = neighbors.includes(itemIndex);

    const { item } = mediaItem;

    switch (mediaItem.type) {
      case MediaType.Image:
        {
          const imageItem = item as Image;
          const {
            width,
            height,
            meta: { thumbnail }
          } = imageItem;
          results[results.length] = (
            <Thumbnail
              key={itemIndex}
              {...{
                width,
                height,
                src: thumbnail
              }}
              size={thumbnailSize}
              selected={selectedItem === itemIndex}
              preload={preload}
              onClick={(): void => {
                setSelectedItem(itemIndex);
              }}
            />
          );
        }
        break;
    }
  }

  return results;
};

export const FilmStrip: FC<FilmStripProps> = memo(({ items, thumbnailSize, selectedItem, setSelectedItem }) => {
  const neighbors = useMemo(() => getNeighborIndexes(selectedItem, items.length, 20), [items.length, selectedItem]);

  const currentNodeRef = useRef<HTMLDivElement | null>(null);

  const { scrollToElement, canScrollLeft, canScrollRight, scrollPageRight, scrollPageLeft } =
    useHorizontalScrollPosition(currentNodeRef);

  useLayoutEffect(() => {
    const currentNode = currentNodeRef.current;

    if (!currentNode) {
      return;
    }

    scrollToElement(currentNode.children[selectedItem]);
  }, [selectedItem, scrollToElement, currentNodeRef]);

  const scrollItems = useMemo(
    () => resolveMediaItems(items, neighbors, selectedItem, setSelectedItem, thumbnailSize),
    [items, neighbors, thumbnailSize, selectedItem, setSelectedItem]
  );

  return (
    <div className={ModuleStyles.container}>
      <div className={ModuleStyles.navigation}>
        <IconButton
          color="primary"
          className={clsx(ModuleStyles.icon, {
            [ModuleStyles.iconVisible]: canScrollLeft
          })}
          onClick={scrollPageLeft}>
          <ChevronLeftIcon />
        </IconButton>
      </div>
      <div className={ModuleStyles.content}>
        <div className={ModuleStyles.contentInner} ref={currentNodeRef}>
          {scrollItems}
        </div>
      </div>
      <div className={ModuleStyles.navigation}>
        <IconButton
          color="primary"
          className={clsx(ModuleStyles.icon, {
            [ModuleStyles.iconVisible]: canScrollRight
          })}
          onClick={scrollPageRight}>
          <ChevronRightIcon />
        </IconButton>
      </div>
    </div>
  );
});
