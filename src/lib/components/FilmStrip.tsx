import { ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon } from '@material-ui/icons';
import { ImageItem, MediaType, VirtualMediaItem } from 'lib/types';
import React, { Dispatch, FC, SetStateAction, memo, useEffect, useMemo, useRef } from 'react';

import { IconButton } from '@material-ui/core';
import ModuleStyles from './FilmStrip.module.scss';
import { Thumbnail } from './Thumbnail';
import clsx from 'clsx';
import { getNeighborIndexes } from 'lib/utils';
import { useHorizontalScrollPosition } from 'lib/hooks';

export type FilmStripProps = {
  items: VirtualMediaItem<unknown>[];
  thumbnailSize?: number;
  selectedItem: number;
  setSelectedItem: Dispatch<SetStateAction<number>>;
};

const resolveMediaItems = (
  items: VirtualMediaItem<unknown>[],
  neighbors: number[],
  selectedItem: number,
  setSelectedItem: Dispatch<SetStateAction<number>>,
  thumbnailSize?: number
): (JSX.Element | null)[] => {
  return items.map((mediaItem, index) => {
    if (!mediaItem || !mediaItem.item) {
      return null;
    }

    const { item } = mediaItem;

    switch (mediaItem.type) {
      case MediaType.Image: {
        const imageItem = item as ImageItem;
        const {
          width,
          height,
          meta: { thumbnail }
        } = imageItem;
        const preload = neighbors.includes(index);
        return (
          <Thumbnail
            key={index}
            {...{
              width,
              height,
              src: thumbnail
            }}
            size={thumbnailSize}
            selected={selectedItem === index}
            preload={preload}
            onClick={(): void => {
              setSelectedItem(index);
            }}
          />
        );
      }
      default:
        return null;
    }
  });
};

export const FilmStrip: FC<FilmStripProps> = memo(({ items, thumbnailSize, selectedItem, setSelectedItem }) => {
  const neighbors = useMemo(() => getNeighborIndexes(selectedItem, items.length, 20), [items.length, selectedItem]);

  const currentNodeRef = useRef<HTMLDivElement | null>(null);

  const { scrollToElement, canScrollLeft, canScrollRight, scrollPageRight, scrollPageLeft } =
    useHorizontalScrollPosition(currentNodeRef);

  useEffect(() => {
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
