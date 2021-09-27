import { Media, MediaItem, MediaType } from '../../types';
import React, { FC, Fragment, memo, useMemo, useRef } from 'react';

import { FlowImageTile } from './FlowImageTile';
import { Image } from '../../types/Image';
import ModuleStyles from './FlowGallery.module.scss';
import clsx from 'clsx';
import { useRect } from '../../hooks';

export type FlowGalleryProps = {
  items: MediaItem<Media>[];
  targetSize: number;
  padding: number;
  margin: number;
};

type Row = {
  items: MediaItem<Media>[];
  width: number;
};

type NormalizedElementRow = {
  isNormalized: boolean;
  items: JSX.Element[];
};

const resolveImageNode = (item: Image, key: string, width: number, height: number, margin: number): JSX.Element => {
  return (
    <Fragment key={key}>
      <FlowImageTile item={item} width={width} height={height} margin={margin} />
    </Fragment>
  );
};

const resolveMediaNodes = (
  items: MediaItem<Media>[],
  normalizedRectWidth: number,
  targetSize: number,
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
            const imageItem = item as Image;
            aspectRatio = imageItem.width / imageItem.height;
          }
          break;
      }
      const normalizedHeight = targetSize;
      const normalizedWidth = Math.ceil(normalizedHeight * aspectRatio);
      const normalizedWidthWithMargin = normalizedWidth + margin * 2;

      if (remainingWidth >= normalizedWidthWithMargin || Math.ceil(normalizedWidthWithMargin / 2) <= remainingWidth) {
        row.items[row.items.length] = mediaItem;
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

  for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
    const row = rows[rowIndex];
    // process current row
    mediaNodes[rowIndex] = mediaNodes[rowIndex] ?? {
      isNormalized: false,
      items: []
    };

    const rowMarginWidth = row.items.length * margin * 2;
    const rowImageWidth = row.width - rowMarginWidth;
    const rowWidthRatio = rowImageWidth / (normalizedRectWidth - rowMarginWidth);

    for (let itemIndex = 0; itemIndex < row.items.length; itemIndex++) {
      const mediaItem = row.items[itemIndex];
      const { item } = mediaItem;
      let aspectRatio = 1.0;
      switch (mediaItem.type) {
        case MediaType.Image:
          {
            const imageItem = item as Image;
            aspectRatio = imageItem.width / imageItem.height;
          }
          break;
      }

      const normalizedHeight = targetSize;
      const normalizedWidth = Math.ceil(normalizedHeight * aspectRatio);

      const rowNormalizedHeight = Math.ceil(normalizedHeight / rowWidthRatio);
      const rowNormalizedWidth = Math.ceil(rowNormalizedHeight * aspectRatio);

      const useRowNormalizedValues = rowIndex < rows.length - 1 || row.width > normalizedRectWidth;

      const height = useRowNormalizedValues ? rowNormalizedHeight : normalizedHeight;
      const width = useRowNormalizedValues ? rowNormalizedWidth : normalizedWidth;

      mediaNodes[rowIndex].isNormalized = useRowNormalizedValues;
      switch (mediaItem.type) {
        case MediaType.Image:
          {
            const imageItem = item as Image;
            mediaNodes[rowIndex].items[itemIndex] = resolveImageNode(
              imageItem,
              `thumbnail - ${rowIndex} - ${itemIndex}`,
              width,
              height,
              margin
            );
          }
          break;
      }
    }
  }

  return mediaNodes;
};

export const FlowGallery: FC<FlowGalleryProps> = memo(({ items, targetSize, padding, margin }) => {
  const containerNodeRef = useRef<HTMLDivElement | null>(null);

  const rect = useRect(containerNodeRef);

  const itemElements = useMemo(() => {
    if (!rect || targetSize <= 0) {
      return [];
    }

    // remove padding from width
    const normalizedRectWidth = Math.floor(rect.width - padding * 2);

    const mediaNodes: NormalizedElementRow[] = resolveMediaNodes(items, normalizedRectWidth, targetSize, margin);

    return mediaNodes;
  }, [items, margin, padding, rect, targetSize]);

  const content = useMemo(() => {
    const rows: JSX.Element[] = [];
    for (let itemIndex = 0; itemIndex < itemElements.length; itemIndex++) {
      const nodes: NormalizedElementRow = itemElements[itemIndex];
      rows[itemIndex] = (
        <div
          key={itemIndex}
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
