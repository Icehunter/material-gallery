import { Image, Media, MediaItem, MediaType } from 'lib/types';
import React, { FC, Fragment, memo, useMemo, useRef } from 'react';

import { GridImageTile } from './GridImageTile';
import ModuleStyles from './GridGallery.module.scss';
import { useRect } from 'lib/hooks/useRect';

export type GridGalleryProps = {
  items: MediaItem<Media>[];
  targetSize: number;
  padding: number;
  margin: number;
  zoomLevel: number;
};

const POSITIVE_ZOOM_LEVELS = [1.1, 1.2, 1.3, 1.4, 1.5];
const NEGATIVE_ZOOM_LEVELS = [0.9, 0.8, 0.7, 0.6, 0.5];

export const GridGallery: FC<GridGalleryProps> = memo(({ items, targetSize, padding, margin, zoomLevel }) => {
  const containerNodeRef = useRef<HTMLDivElement | null>(null);

  const rect = useRect(containerNodeRef);

  const itemElements = useMemo(() => {
    if (!rect) {
      return [];
    }

    let zoomTargetSize = targetSize;
    if (zoomLevel < 0) {
      zoomTargetSize = Math.floor(zoomTargetSize * NEGATIVE_ZOOM_LEVELS[Math.abs(zoomLevel) - 1]);
    }
    if (zoomLevel > 0) {
      zoomTargetSize = Math.floor(zoomTargetSize * POSITIVE_ZOOM_LEVELS[zoomLevel - 1]);
    }
    // remove padding from width
    const normalizedRectWidth = Math.floor(rect.width - padding * 2);
    // get optimal column count based on adjusted target size and with
    const columnCount = Math.floor(normalizedRectWidth / zoomTargetSize);
    // find optimal target size; account for margins around images
    const normalizedTargetSize = Math.floor(normalizedRectWidth / columnCount) - margin * 2;

    const results = [];

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
  }, [items, margin, padding, rect, targetSize, zoomLevel]);

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
