import { ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon } from '@material-ui/icons';
import React, { Dispatch, FC, SetStateAction, memo, useEffect, useMemo, useRef } from 'react';

import { IconButton } from '@material-ui/core';
import ModuleStyles from './FilmStrip.module.scss';
import { Thumbnail } from './Thumbnail';
import { VirtualImageItem } from '../types/ImageItem';
import clsx from 'clsx';
import { getNeighborIndexes } from 'lib/utils/getNeighborIndexes';
import { useHorizontalScrollPosition } from '../hooks/useHorizontalScrollPosition';

export type FilmStripProps = {
  items: VirtualImageItem[];
  selectedItem: number;
  setSelectedItem: Dispatch<SetStateAction<number>>;
};

export const FilmStrip: FC<FilmStripProps> = memo(({ items, selectedItem, setSelectedItem }) => {
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

  const scrollItems = useMemo(() => {
    return items.map((item, index) => {
      if (!item) {
        return null;
      }
      const preload = neighbors.includes(index);
      return (
        <Thumbnail
          key={index}
          {...item.thumbnail}
          src={item.thumbnail.url}
          selected={selectedItem === index}
          preload={preload}
          onClick={(): void => {
            setSelectedItem(index);
          }}
        />
      );
    });
  }, [items, selectedItem, neighbors, setSelectedItem]);

  return (
    <div className={ModuleStyles.container}>
      <IconButton
        color="primary"
        className={clsx(ModuleStyles.navigation, {
          [ModuleStyles.navigationVisible]: canScrollLeft
        })}
        onClick={scrollPageLeft}>
        <ChevronLeftIcon />
      </IconButton>
      <div className={ModuleStyles.wrapper}>
        <div className={ModuleStyles.wrapperInner} ref={currentNodeRef}>
          {scrollItems}
        </div>
      </div>
      <IconButton
        color="primary"
        className={clsx(ModuleStyles.navigation, {
          [ModuleStyles.navigationVisible]: canScrollRight
        })}
        onClick={scrollPageRight}>
        <ChevronRightIcon />
      </IconButton>
    </div>
  );
});
