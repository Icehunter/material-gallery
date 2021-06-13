import { GridGallery, GridGalleryProps } from '../lib';
import { Meta, Story } from '@storybook/react/types-6-0';
import { TargetType, UnsplashCollectionSource, useUnsplashStatic } from './hooks/useUnsplashStatic';

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
  const images = useUnsplashStatic({
    imageCount,
    targetSize: targetSize,
    targetType: TargetType.Height,
    collectionSource
  });

  return (
    <div
      style={{
        width: '100%',
        height: '100%'
      }}>
      <GridGallery items={images} zoomLevel={zoomLevel} targetSize={targetSize} padding={padding} margin={margin} />
    </div>
  );
};

export const GridGalleryDefault = Template.bind({});
