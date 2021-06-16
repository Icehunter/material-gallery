import { MediaItem, MediaType, VirtualMediaItem } from 'lib/types';
import React, { FC, Fragment, memo, useMemo, useRef } from 'react';

import { FlowImageTile } from './FlowImageTile';
import { ImageItem } from 'lib/types/ImageItem';
import ModuleStyles from './FlowGallery.module.scss';
import clsx from 'clsx';
import { useRect } from 'lib/hooks/useRect';

export type FlowGalleryProps = {
  items: VirtualMediaItem<unknown>[];
  targetSize: number;
  padding: number;
  margin: number;
  zoomLevel: number;
};

const POSITIVE_ZOOM_LEVELS = [1.1, 1.2, 1.3, 1.4, 1.5];
const NEGATIVE_ZOOM_LEVELS = [0.9, 0.8, 0.7, 0.6, 0.5];

type Row = {
  items: MediaItem<unknown>[];
  width: number;
};

type NormalizedElementRow = {
  isNormalized: boolean;
  items: JSX.Element[];
};

const resolveImageNode = (item: ImageItem, key: string, width: number, height: number, margin: number): JSX.Element => {
  return (
    <Fragment key={key}>
      <FlowImageTile item={item} width={width} height={height} margin={margin} />
    </Fragment>
  );
};

const resolveMediaNodes = (
  items: VirtualMediaItem<unknown>[],
  normalizedRectWidth: number,
  zoomTargetSize: number,
  margin: number
): NormalizedElementRow[] => {
  const mediaNodes: NormalizedElementRow[] = [];
  const rows: Row[] = [];

  let currentRow = 0;

  for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
    const mediaItem = items[itemIndex];
    // ensure current row is assigned
    rows[currentRow] = rows[currentRow] ?? {
      items: [],
      width: 0
    };
    const row = rows[currentRow];

    if (!mediaItem || !mediaItem.item) {
      continue;
    }

    const { item } = mediaItem;

    if (item) {
      const remainingWidth = normalizedRectWidth - row.width;
      let aspectRatio = 1.0;
      switch (mediaItem.type) {
        case MediaType.Image:
          {
            const imageItem = item as ImageItem;
            aspectRatio = imageItem.width / imageItem.height;
          }
          break;
      }
      const normalizedHeight = zoomTargetSize;
      const normalizedWidth = Math.floor(normalizedHeight * aspectRatio);
      const normalizedWidthWithMargin = normalizedWidth + margin * 2;

      if (remainingWidth >= normalizedWidthWithMargin || Math.floor(normalizedWidthWithMargin / 2) <= remainingWidth) {
        row.items.push(mediaItem);
        row.width += normalizedWidthWithMargin;
      } else {
        currentRow++;
        rows[currentRow] = rows[currentRow] ?? {
          items: [mediaItem],
          width: normalizedWidthWithMargin
        };
      }
    }
  }

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    // process current row
    mediaNodes[i] = mediaNodes[i] ?? {
      isNormalized: false,
      items: []
    };

    const rowMarginWidth = row.items.length * margin * 2;
    const rowImageWidth = row.width - rowMarginWidth;
    const rowWidthRatio = rowImageWidth / (normalizedRectWidth - rowMarginWidth);

    for (let j = 0; j < row.items.length; j++) {
      const mediaItem = row.items[j];
      const { item } = mediaItem;
      let aspectRatio = 1.0;
      switch (mediaItem.type) {
        case MediaType.Image:
          {
            const imageItem = item as ImageItem;
            aspectRatio = imageItem.width / imageItem.height;
          }
          break;
      }

      const normalizedHeight = zoomTargetSize;
      const normalizedWidth = Math.floor(normalizedHeight * aspectRatio);

      const rowNormalizedHeight = Math.floor(normalizedHeight / rowWidthRatio);
      const rowNormalizedWidth = Math.floor(rowNormalizedHeight * aspectRatio);

      const useRowNormalizedValues = i < rows.length - 1 || row.width > normalizedRectWidth;

      const height = useRowNormalizedValues ? rowNormalizedHeight : normalizedHeight;
      const width = useRowNormalizedValues ? rowNormalizedWidth : normalizedWidth;

      mediaNodes[i].isNormalized = useRowNormalizedValues;
      switch (mediaItem.type) {
        case MediaType.Image:
          {
            const imageItem = item as ImageItem;
            mediaNodes[i].items[j] = resolveImageNode(imageItem, `thumbnail - ${i} - ${j}`, width, height, margin);
          }
          break;
      }
    }
  }

  return mediaNodes;
};

export const FlowGallery: FC<FlowGalleryProps> = memo(({ items, targetSize, padding, margin, zoomLevel }) => {
  const containerNodeRef = useRef<HTMLDivElement | null>(null);

  const rect = useRect(containerNodeRef);

  const itemElements = useMemo(() => {
    if (!rect) {
      return [];
    }

    let zoomTargetSize = targetSize;
    if (zoomLevel < 0) {
      zoomTargetSize = Math.floor(targetSize * NEGATIVE_ZOOM_LEVELS[Math.abs(zoomLevel) - 1]);
    }
    if (zoomLevel > 0) {
      zoomTargetSize = Math.floor(targetSize * POSITIVE_ZOOM_LEVELS[zoomLevel - 1]);
    }
    // remove padding from width
    const normalizedRectWidth = Math.floor(rect.width - padding * 2);

    const mediaNodes: NormalizedElementRow[] = resolveMediaNodes(items, normalizedRectWidth, zoomTargetSize, margin);

    return mediaNodes;
  }, [items, margin, padding, rect, targetSize, zoomLevel]);

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
