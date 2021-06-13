import { ImageItem, VirtualImageItem } from 'lib/types/ImageItem';
import React, { FC, Fragment, memo, useMemo, useRef } from 'react';

import { GalleryImage } from './GalleryImage';
import ModuleStyles from './FlowGallery.module.scss';
import clsx from 'clsx';
import { useRect } from 'lib/hooks/useRect';

export type FlowGalleryProps = {
  items: VirtualImageItem[];
  targetHeight: number;
  padding: number;
  margin: number;
  zoomLevel: number;
};

const POSITIVE_ZOOM_LEVELS = [1.1, 1.2, 1.3, 1.4, 1.5];
const NEGATIVE_ZOOM_LEVELS = [0.9, 0.8, 0.7, 0.6, 0.5];

type Row = {
  items: ImageItem[];
  width: number;
};

const createGalleryImage = (
  item: ImageItem,
  key: string,
  className: string,
  height: number,
  width: number,
  margin: number
): JSX.Element => {
  return (
    <GalleryImage
      key={key}
      className={className}
      src={item.src}
      srcSet={item.srcSet}
      style={{
        height,
        width,
        margin
      }}
    />
  );
};

type NormalizedElementRow = {
  isNormalized: boolean;
  items: JSX.Element[];
};

const resolveImageNodes = (
  items: VirtualImageItem[],
  normalizedRectWidth: number,
  zoomTargetSize: number,
  margin: number
): NormalizedElementRow[] => {
  const imageNodes: NormalizedElementRow[] = [];
  const rows: Row[] = [];

  let currentRow = 0;

  for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
    const item = items[itemIndex];
    // ensure current row is assigned
    rows[currentRow] = rows[currentRow] ?? {
      items: [],
      width: 0
    };
    const row = rows[currentRow];

    if (item) {
      const remainingWidth = normalizedRectWidth - row.width;
      const aspectRatio = item.width / item.height;
      const normalizedHeight = zoomTargetSize;
      const normalizedWidth = Math.floor(normalizedHeight * aspectRatio);
      const normalizedWidthWithMargin = normalizedWidth + margin * 2;

      if (remainingWidth >= normalizedWidthWithMargin || Math.floor(normalizedWidthWithMargin / 2) <= remainingWidth) {
        row.items.push(item);
        row.width += normalizedWidthWithMargin;
      } else {
        currentRow++;
        rows[currentRow] = rows[currentRow] ?? {
          items: [item],
          width: normalizedWidthWithMargin
        };
      }
    }
  }

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    // process current row
    imageNodes[i] = imageNodes[i] ?? {
      isNormalized: false,
      items: []
    };

    const rowMarginWidth = row.items.length * margin * 2;
    const rowImageWidth = row.width - rowMarginWidth;
    const rowWidthRatio = rowImageWidth / (normalizedRectWidth - rowMarginWidth);

    for (let j = 0; j < row.items.length; j++) {
      const item = row.items[j];

      const aspectRatio = item.width / item.height;

      const normalizedHeight = zoomTargetSize;
      const normalizedWidth = Math.floor(normalizedHeight * aspectRatio);

      const rowNormalizedHeight = Math.floor(normalizedHeight / rowWidthRatio);
      const rowNormalizedWidth = Math.floor(rowNormalizedHeight * aspectRatio);

      const useRowNormalizedValues = i < rows.length - 1 || row.width > normalizedRectWidth;

      const height = useRowNormalizedValues ? rowNormalizedHeight : normalizedHeight;
      const width = useRowNormalizedValues ? rowNormalizedWidth : normalizedWidth;

      imageNodes[i].isNormalized = useRowNormalizedValues;
      imageNodes[i].items[j] = createGalleryImage(
        item,
        `thumbnail - ${i} - ${j}`,
        ModuleStyles.image,
        height,
        width,
        margin
      );
    }
  }

  return imageNodes;
};

export const FlowGallery: FC<FlowGalleryProps> = memo(({ items, targetHeight, padding, margin, zoomLevel }) => {
  const containerNodeRef = useRef<HTMLDivElement | null>(null);

  const rect = useRect(containerNodeRef);

  const itemElements = useMemo(() => {
    if (!rect) {
      return [];
    }

    let zoomTargetSize = targetHeight;
    if (zoomLevel < 0) {
      zoomTargetSize = Math.floor(targetHeight * NEGATIVE_ZOOM_LEVELS[Math.abs(zoomLevel) - 1]);
    }
    if (zoomLevel > 0) {
      zoomTargetSize = Math.floor(targetHeight * POSITIVE_ZOOM_LEVELS[zoomLevel - 1]);
    }
    // remove padding from width
    const normalizedRectWidth = Math.floor(rect.width - padding * 2);

    const imageNodes: NormalizedElementRow[] = resolveImageNodes(items, normalizedRectWidth, zoomTargetSize, margin);

    return imageNodes;
  }, [items, margin, padding, rect, targetHeight, zoomLevel]);

  const content = useMemo(() => {
    const rows: JSX.Element[] = [];
    for (let i = 0; i < itemElements.length; i++) {
      const nodes: NormalizedElementRow = itemElements[i];
      rows[i] = (
        <div
          key={i}
          className={clsx(ModuleStyles.row, {
            [ModuleStyles.normalizedRow]: nodes.isNormalized
          })}>
          {nodes.items.map((node, nodeIndex: number) => {
            return <Fragment key={nodeIndex}>{node}</Fragment>;
          })}
        </div>
      );
    }
    return rows;
  }, [itemElements]);

  return (
    <div
      className={ModuleStyles.container}
      ref={containerNodeRef}
      style={{
        padding
      }}>
      {content}
    </div>
  );
});
