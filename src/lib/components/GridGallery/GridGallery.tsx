import { Image, Media, MediaItem, MediaType } from 'lib/types';
import React, { FC, Fragment, memo, useMemo, useRef } from 'react';

import { GridImageTile } from './GridImageTile';
import ModuleStyles from './GridGallery.module.scss';
import { useRect } from 'lib/hooks';

export type GridGalleryProps = {
  items: MediaItem<Media>[];
  targetSize: number;
  padding: number;
  margin: number;
};

export const GridGallery: FC<GridGalleryProps> = memo(({ items, targetSize, padding, margin }) => {
  const containerNodeRef = useRef<HTMLDivElement | null>(null);

  const rect = useRect(containerNodeRef);

  const itemElements = useMemo(() => {
    const results: JSX.Element[] = [];

    if (!rect) {
      return results;
    }

    // remove padding from width
    const normalizedRectWidth = Math.floor(rect.width - padding * 2);
    // get optimal column count based on adjusted target size and with
    const columnCount = Math.max(Math.floor(normalizedRectWidth / targetSize), 1);

    // find optimal target size; account for margins around images
    const normalizedTargetSize = Math.floor(normalizedRectWidth / columnCount) - margin * 2;

    if (normalizedTargetSize <= 0) {
      return results;
    }

    for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
      const mediaItem = items[itemIndex];

      if (!mediaItem || !mediaItem.item) {
        continue;
      }

      const { item } = mediaItem;

      switch (mediaItem.type) {
        case MediaType.Image:
          {
            const imageItem = item as Image;
            results[results.length] = (
              <Fragment key={`thumbnail - ${itemIndex}`}>
                <GridImageTile
                  item={imageItem}
                  width={normalizedTargetSize}
                  height={normalizedTargetSize}
                  margin={margin}
                />
              </Fragment>
            );
          }
          break;
      }
    }

    return results;
  }, [items, margin, padding, rect, targetSize]);

  return (
    <div
      className={ModuleStyles.container}
      ref={containerNodeRef}
      style={{
        padding
      }}>
      {itemElements}
    </div>
  );
});
