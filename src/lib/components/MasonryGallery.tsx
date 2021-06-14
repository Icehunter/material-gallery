import { ImageItem, VirtualImageItem } from 'lib/types/ImageItem';
import React, { FC, Fragment, memo, useMemo, useRef } from 'react';

import { GalleryImage } from './GalleryImage';
import ModuleStyles from './MasonryGallery.module.scss';
import clsx from 'clsx';
import { findAndInsertByProperty } from 'lib/utils/arrays';
import { useRect } from 'lib/hooks/useRect';

export enum MasonryGalleryDirection {
  Vertical = 'Vertical',
  Horizontal = 'Horizontal'
}

export type MasonryGalleryProps = {
  items: VirtualImageItem[];
  targetSize: number;
  padding: number;
  margin: number;
  zoomLevel: number;
  direction: MasonryGalleryDirection;
};

const POSITIVE_ZOOM_LEVELS = [1.1, 1.2, 1.3, 1.4, 1.5];
const NEGATIVE_ZOOM_LEVELS = [0.9, 0.8, 0.7, 0.6, 0.5];

type Panel = {
  index: number;
  items: ImageItem[];
  size: number;
};

type ElementPanel = {
  panelIndex: number;
  items: JSX.Element[];
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
      style={{
        height,
        width,
        margin
      }}
    />
  );
};

const resolveImageNodes = (
  items: VirtualImageItem[],
  normalizedRectSize: number,
  zoomTargetSize: number,
  margin: number,
  direction: MasonryGalleryDirection
): ElementPanel[] => {
  const imageNodes: ElementPanel[] = [];

  // get optimal panel count based on adjusted target size and with
  const panelCount = Math.ceil(normalizedRectSize / zoomTargetSize);
  // find optimal target size; account for margins around images
  const normalizedTargetSize = Math.floor(normalizedRectSize / panelCount) - margin * 2;

  if (panelCount <= 0) {
    return [];
  }

  const panels: Panel[] = [
    ...Array(panelCount)
      .fill(undefined)
      .map((_, index) => ({
        index,
        items: [],
        size: 0
      }))
  ];

  for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
    const item = items[itemIndex];

    if (item) {
      const panel = panels.shift() as Panel;

      switch (direction) {
        case MasonryGalleryDirection.Vertical:
          {
            const aspectRatio = item.height / item.width;

            const normalizedWidth = normalizedTargetSize;
            const normalizedHeight = Math.floor(normalizedWidth * aspectRatio);

            panel.size += normalizedHeight;
          }
          break;
        case MasonryGalleryDirection.Horizontal:
          {
            const aspectRatio = item.width / item.height;

            const normalizedHeight = normalizedTargetSize;
            const normalizedWidth = Math.floor(normalizedHeight * aspectRatio);

            panel.size += normalizedWidth;
          }
          break;
      }

      panel.items.push(item);

      const insertionIndex = findAndInsertByProperty<Panel>(panels, panel, 'size');

      panels.splice(insertionIndex, 0, panel);
    }
  }

  for (let i = 0; i < panels.length; i++) {
    const panel = panels[i];

    // process current panels
    imageNodes[i] = imageNodes[i] ?? {
      panelIndex: panel.index,
      items: []
    };

    for (let j = 0; j < panel.items.length; j++) {
      const item = panel.items[j];

      let height = 200;
      let width = 200;

      switch (direction) {
        case MasonryGalleryDirection.Vertical:
          {
            const aspectRatio = item.height / item.width;
            width = normalizedTargetSize;
            height = Math.floor(width * aspectRatio);
          }
          break;
        case MasonryGalleryDirection.Horizontal:
          {
            const aspectRatio = item.width / item.height;
            height = normalizedTargetSize;
            width = Math.floor(height * aspectRatio);
          }
          break;
      }

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

export const MasonryGallery: FC<MasonryGalleryProps> = memo(
  ({ items, targetSize, padding, margin, zoomLevel, direction }) => {
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
      const normalizedRectSize =
        Math.floor(direction === MasonryGalleryDirection.Vertical ? rect.width : rect.height) - padding * 2;

      const imageNodes = resolveImageNodes(items, normalizedRectSize, zoomTargetSize, margin, direction);

      imageNodes.sort((a, b) => {
        if (a.panelIndex > b.panelIndex) {
          return 1;
        }
        if (a.panelIndex < b.panelIndex) {
          return -1;
        }
        return 0;
      });

      return imageNodes;
    }, [direction, items, margin, padding, rect, targetSize, zoomLevel]);

    const content = useMemo(() => {
      const panels: JSX.Element[] = [];
      for (let i = 0; i < itemElements.length; i++) {
        const nodes: ElementPanel = itemElements[i];
        panels[i] = (
          <div
            key={i}
            className={clsx(ModuleStyles.panel, {
              [ModuleStyles.Vertical]: direction === MasonryGalleryDirection.Vertical,
              [ModuleStyles.Horizontal]: direction === MasonryGalleryDirection.Horizontal
            })}>
            {nodes.items.map((node, nodeIndex: number) => {
              return <Fragment key={nodeIndex}>{node}</Fragment>;
            })}
          </div>
        );
      }
      return panels;
    }, [direction, itemElements]);

    return (
      <div
        style={{
          height: '100%',
          width: '100%',
          ...(direction === MasonryGalleryDirection.Horizontal ? { overflow: 'auto' } : undefined)
        }}>
        <div
          className={clsx(ModuleStyles.container, {
            [ModuleStyles.Vertical]: direction === MasonryGalleryDirection.Vertical,
            [ModuleStyles.Horizontal]: direction === MasonryGalleryDirection.Horizontal
          })}
          ref={containerNodeRef}
          style={{
            ...(direction === MasonryGalleryDirection.Vertical ? { padding } : undefined)
          }}>
          {direction === MasonryGalleryDirection.Vertical ? content : <div style={{ margin: padding }}>{content}</div>}
        </div>
      </div>
    );
  }
);
