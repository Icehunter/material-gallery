import React, { FC, memo, useMemo, useRef } from 'react';

import { ImageTile } from './ImageTile';
import ModuleStyles from './GridGallery.module.scss';
import { VirtualImageItem } from 'lib/types/ImageItem';
import { useRect } from 'lib/hooks/useRect';

export type GridGalleryProps = {
  items: VirtualImageItem[];
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

    return items.map((item, index) => {
      if (!item) {
        return null;
      }
      return (
        <ImageTile
          item={item}
          key={`thumbnail - ${index}`}
          width={normalizedTargetSize}
          height={normalizedTargetSize}
          margin={margin}
        />
      );
    });
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
