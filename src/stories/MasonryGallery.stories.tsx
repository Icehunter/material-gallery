import { MasonryGallery, MasonryGalleryDirection, MasonryGalleryProps } from '../lib';
import { Meta, Story } from '@storybook/react/types-6-0';
import { TargetType, UnsplashCollectionSource, useUnsplashStatic } from './hooks';
import { collectionSource, imageCount, themePaletteType, zoomLevel } from './argTypes';

import React from 'react';

export default {
  title: 'Galleries/MasonryGallery',
  component: MasonryGallery,
  args: {
    imageCount: 50,
    zoomLevel: 0,
    targetSize: 320,
    padding: 20,
    margin: 5,
    direction: MasonryGalleryDirection.Vertical,
    collectionSource: UnsplashCollectionSource.Landscape
  },
  argTypes: {
    collectionSource,
    imageCount,
    themePaletteType,
    zoomLevel
  },
  parameters: {
    layout: 'fullscreen'
  }
} as Meta<MasonryGalleryProps>;

const Template: Story<
  MasonryGalleryProps & { imageCount: number; zoomLevel: number; collectionSource: UnsplashCollectionSource }
> = ({ zoomLevel, targetSize, padding, margin, imageCount, direction, collectionSource }) => {
  const collection = useUnsplashStatic({
    imageCount,
    targetSize: targetSize,
    targetType: direction === MasonryGalleryDirection.Vertical ? TargetType.Width : TargetType.Height,
    collectionSource
  });
  const mediaItems = collection?.items ?? [];

  return (
    <MasonryGallery
      items={mediaItems}
      zoomLevel={zoomLevel}
      targetSize={targetSize}
      padding={padding}
      margin={margin}
      direction={direction}
    />
  );
};

export const MasonryGalleryDefault = Template.bind({});
