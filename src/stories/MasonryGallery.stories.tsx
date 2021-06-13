import { MasonryGallery, MasonryGalleryDirection, MasonryGalleryProps } from '../lib';
import { Meta, Story } from '@storybook/react/types-6-0';
import { TargetType, UnsplashCollectionSource, useUnsplashStatic } from './hooks/useUnsplashStatic';

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
    imageCount: {
      control: { type: 'range', min: 1, max: 300, step: 1 }
    },
    zoomLevel: {
      control: { type: 'range', min: -5, max: 5, step: 1 }
    },
    direction: {
      defaultValue: MasonryGalleryDirection.Vertical,
      control: {
        type: 'select',
        options: Object.keys(MasonryGalleryDirection)
      }
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
} as Meta<MasonryGalleryProps>;

const Template: Story<
  MasonryGalleryProps & { imageCount: number; zoomLevel: number; collectionSource: UnsplashCollectionSource }
> = ({ zoomLevel, targetSize, padding, margin, imageCount, direction, collectionSource }) => {
  const images = useUnsplashStatic({
    imageCount,
    targetSize: targetSize,
    targetType: direction === MasonryGalleryDirection.Vertical ? TargetType.Width : TargetType.Height,
    collectionSource
  });

  return (
    <div
      style={{
        width: '100%',
        height: '100%'
      }}>
      <MasonryGallery
        items={images}
        zoomLevel={zoomLevel}
        targetSize={targetSize}
        padding={padding}
        margin={margin}
        direction={direction}
      />
    </div>
  );
};

export const MasonryGalleryDefault = Template.bind({});
