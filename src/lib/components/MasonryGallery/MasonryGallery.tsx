import { Media, MediaItem, MediaType } from 'lib/types';
import React, { FC, Fragment, memo, useMemo, useRef } from 'react';

import { Image } from 'lib/types/Image';
import { MasonryImageTile } from './MasonryImageTile';
import ModuleStyles from './MasonryGallery.module.scss';
import clsx from 'clsx';
import { findAndInsertByProperty } from 'lib/utils/arrays';
import { useRect } from 'lib/hooks/useRect';

export enum MasonryGalleryDirection {
  Vertical = 'Vertical',
  Horizontal = 'Horizontal'
}

export type MasonryGalleryProps = {
  items: MediaItem<Media>[];
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
  items: MediaItem<Media>[];
  size: number;
};

type ElementPanel = {
  panelIndex: number;
  items: JSX.Element[];
};

const resolveImageNode = (item: Image, key: string, width: number, height: number, margin: number): JSX.Element => {
  return (
    <Fragment key={key}>
      <MasonryImageTile item={item} width={width} height={height} margin={margin} />
    </Fragment>
  );
};

const resolveMediaNodes = (
  items: MediaItem<Media>[],
  normalizedRectSize: number,
  zoomTargetSize: number,
  margin: number,
  direction: MasonryGalleryDirection
): ElementPanel[] => {
  const mediaNodes: ElementPanel[] = [];

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

  // resolve element sizes
  for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
    const mediaItem = items[itemIndex];

    if (!mediaItem || !mediaItem.item) {
      continue;
    }

    const { item } = mediaItem;

    if (item) {
      const panel = panels.shift() as Panel;

      switch (direction) {
        case MasonryGalleryDirection.Vertical:
          {
            let aspectRatio = 1.0;
            switch (mediaItem.type) {
              case MediaType.Image:
                {
                  const imageItem = item as Image;
                  aspectRatio = imageItem.height / imageItem.width;
                }
                break;
            }

            const normalizedWidth = normalizedTargetSize;
            const normalizedHeight = Math.floor(normalizedWidth * aspectRatio);

            panel.size += normalizedHeight;
          }
          break;
        case MasonryGalleryDirection.Horizontal:
          {
            let aspectRatio = 1.0;
            switch (mediaItem.type) {
              case MediaType.Image:
                {
                  const imageItem = item as Image;
                  aspectRatio = imageItem.width / imageItem.height;
                }
                break;
            }

            const normalizedHeight = normalizedTargetSize;
            const normalizedWidth = Math.floor(normalizedHeight * aspectRatio);

            panel.size += normalizedWidth;
          }
          break;
      }

      panel.items[panel.items.length] = mediaItem;

      const insertionIndex = findAndInsertByProperty<Panel>(panels, panel, 'size');

      panels.splice(insertionIndex, 0, panel);
    }
  }

  for (let panelIndex = 0; panelIndex < panels.length; panelIndex++) {
    const panel = panels[panelIndex];

    // process current panels
    mediaNodes[panelIndex] = mediaNodes[panelIndex] ?? {
      panelIndex: panel.index,
      items: []
    };

    for (let itemIndex = 0; itemIndex < panel.items.length; itemIndex++) {
      const mediaItem = panel.items[itemIndex];
      const { item } = mediaItem;

      let height = 200;
      let width = 200;

      switch (direction) {
        case MasonryGalleryDirection.Vertical:
          {
            let aspectRatio = 1.0;
            switch (mediaItem.type) {
              case MediaType.Image:
                {
                  const imageItem = item as Image;
                  aspectRatio = imageItem.height / imageItem.width;
                }
                break;
            }
            width = normalizedTargetSize;
            height = Math.floor(width * aspectRatio);
          }
          break;
        case MasonryGalleryDirection.Horizontal:
          {
            let aspectRatio = 1.0;
            switch (mediaItem.type) {
              case MediaType.Image:
                {
                  const imageItem = item as Image;
                  aspectRatio = imageItem.width / imageItem.height;
                }
                break;
            }
            height = normalizedTargetSize;
            width = Math.floor(height * aspectRatio);
          }
          break;
      }
      switch (mediaItem.type) {
        case MediaType.Image:
          {
            const imageItem = item as Image;
            mediaNodes[panelIndex].items[itemIndex] = resolveImageNode(
              imageItem,
              `thumbnail - ${panelIndex} - ${itemIndex}`,
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

export const MasonryGallery: FC<MasonryGalleryProps> = memo(
  ({ items, targetSize, padding, margin, zoomLevel, direction }) => {
    const containerNodeRef = useRef<HTMLDivElement | null>(null);

    const rect = useRect(containerNodeRef);

    const elements = useMemo(() => {
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

      const mediaNodes = resolveMediaNodes(items, normalizedRectSize, zoomTargetSize, margin, direction);

      mediaNodes.sort((a, b) => {
        if (a.panelIndex > b.panelIndex) {
          return 1;
        }
        if (a.panelIndex < b.panelIndex) {
          return -1;
        }
        return 0;
      });

      return mediaNodes;
    }, [direction, items, margin, padding, rect, targetSize, zoomLevel]);

    const content = useMemo(() => {
      const panels: JSX.Element[] = [];
      for (let elementIndex = 0; elementIndex < elements.length; elementIndex++) {
        const element: ElementPanel = elements[elementIndex];

        const nodes = [];

        for (let nodeIndex = 0; nodeIndex < element.items.length; nodeIndex++) {
          const node = element.items[nodeIndex];

          nodes[nodeIndex] = <Fragment key={nodeIndex}>{node}</Fragment>;
        }

        panels[elementIndex] = (
          <div
            key={elementIndex}
            className={clsx(ModuleStyles.panel, {
              [ModuleStyles.Vertical]: direction === MasonryGalleryDirection.Vertical,
              [ModuleStyles.Horizontal]: direction === MasonryGalleryDirection.Horizontal
            })}>
            {nodes}
          </div>
        );
      }
      return panels;
    }, [direction, elements]);

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
