import { MasonryGallery, MasonryGalleryDirection, MasonryGalleryProps } from '../lib';
import { Meta, Story } from '@storybook/react/types-6-0';
import { TargetType, UnsplashCollectionSource, useUnsplashStatic } from './hooks';
import { collectionSource, direction, imageCount, themePaletteType, zoomScale } from './argTypes';

import React from 'react';

export default {
  title: 'Galleries/MasonryGallery',
  component: MasonryGallery,
  args: {
    imageCount: 50,
    zoomScale: 1,
    targetSize: 320,
    padding: 20,
    margin: 5,
    direction: MasonryGalleryDirection.Vertical,
    collectionSource: UnsplashCollectionSource.Landscape
  },
  argTypes: {
    collectionSource,
    direction,
    imageCount,
    themePaletteType,
    zoomScale
  },
  parameters: {
    layout: 'fullscreen'
  }
} as Meta<MasonryGalleryProps>;

const Template: Story<
  MasonryGalleryProps & { imageCount: number; zoomScale: number; collectionSource: UnsplashCollectionSource }
> = ({ zoomScale, targetSize, padding, margin, imageCount, direction, collectionSource }) => {
  const normalizedTargetSize = Math.floor(targetSize * zoomScale);

  const collection = useUnsplashStatic({
    imageCount,
    targetSize: normalizedTargetSize,
    targetType: direction === MasonryGalleryDirection.Vertical ? TargetType.Width : TargetType.Height,
    collectionSource
  });
  const mediaItems = collection?.items ?? [];

  return (
    <MasonryGallery
      items={mediaItems}
      targetSize={normalizedTargetSize}
      padding={padding}
      margin={margin}
      direction={direction}
    />
  );
};

export const MasonryGalleryDefault = Template.bind({});
