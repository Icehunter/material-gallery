import { GridGallery, GridGalleryProps } from '../lib';
import { Meta, Story } from '@storybook/react/types-6-0';
import { TargetType, UnsplashCollectionSource, useUnsplashStatic } from './hooks';

import React from 'react';

export default {
  title: 'Galleries/GridGallery',
  component: GridGallery,
  args: {
    imageCount: 50,
    zoomLevel: 0,
    targetSize: 180,
    padding: 20,
    margin: 5,
    collectionSource: UnsplashCollectionSource.Landscape
  },
  argTypes: {
    imageCount: {
      control: { type: 'range', min: 1, max: 300, step: 1 }
    },
    zoomLevel: {
      control: { type: 'range', min: -5, max: 5, step: 1 }
    },
    collectionSource: {
      defaultValue: UnsplashCollectionSource.Landscape,
      control: {
        type: 'select',
        options: Object.keys(UnsplashCollectionSource)
      }
    }
  },
  parameters: {
    layout: 'fullscreen'
  }
} as Meta<GridGalleryProps>;

const Template: Story<
  GridGalleryProps & { imageCount: number; zoomLevel: number; collectionSource: UnsplashCollectionSource }
> = ({ zoomLevel, targetSize, padding, margin, imageCount, collectionSource }) => {
  const collection = useUnsplashStatic({
    imageCount,
    targetSize: targetSize,
    targetType: TargetType.Height,
    collectionSource
  });
  const mediaItems = collection?.items ?? [];

  return (
    <GridGallery items={mediaItems} zoomLevel={zoomLevel} targetSize={targetSize} padding={padding} margin={margin} />
  );
};

export const GridGalleryDefault = Template.bind({});
