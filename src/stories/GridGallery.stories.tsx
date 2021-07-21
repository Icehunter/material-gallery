import { GridGallery, GridGalleryProps } from '../lib';
import { Meta, Story } from '@storybook/react/types-6-0';
import { TargetType, UnsplashCollectionSource, useUnsplashStatic } from './hooks';
import { collectionSource, imageCount, themePaletteType, zoomScale } from './argTypes';

import React from 'react';

export default {
  title: 'Galleries/GridGallery',
  component: GridGallery,
  args: {
    imageCount: 50,
    zoomScale: 1,
    targetSize: 180,
    padding: 20,
    margin: 5,
    collectionSource: UnsplashCollectionSource.Landscape
  },
  argTypes: {
    collectionSource,
    imageCount,
    themePaletteType,
    zoomScale
  },
  parameters: {
    layout: 'fullscreen'
  }
} as Meta<GridGalleryProps>;

const Template: Story<
  GridGalleryProps & { imageCount: number; zoomScale: number; collectionSource: UnsplashCollectionSource }
> = ({ zoomScale, targetSize, padding, margin, imageCount, collectionSource }) => {
  const normalizedTargetSize = Math.floor(targetSize * zoomScale);

  const collection = useUnsplashStatic({
    imageCount,
    targetSize: normalizedTargetSize,
    targetType: TargetType.Height,
    collectionSource
  });
  const mediaItems = collection?.items ?? [];

  return <GridGallery items={mediaItems} targetSize={normalizedTargetSize} padding={padding} margin={margin} />;
};

export const GridGalleryDefault = Template.bind({});
