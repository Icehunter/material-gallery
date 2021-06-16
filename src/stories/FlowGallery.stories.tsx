import { FlowGallery, FlowGalleryProps } from '../lib';
import { Meta, Story } from '@storybook/react/types-6-0';
import { UnsplashCollectionSource, useUnsplashStatic } from './hooks';

import React from 'react';

export default {
  title: 'Galleries/FlowGallery',
  component: FlowGallery,
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
} as Meta<FlowGalleryProps>;

const Template: Story<
  FlowGalleryProps & { imageCount: number; zoomLevel: number; collectionSource: UnsplashCollectionSource }
> = ({ zoomLevel, targetSize, padding, margin, imageCount, collectionSource }) => {
  const collection = useUnsplashStatic({ imageCount, targetSize: targetSize, collectionSource });
  const mediaItems = collection?.items ?? [];

  return (
    <FlowGallery items={mediaItems} zoomLevel={zoomLevel} targetSize={targetSize} padding={padding} margin={margin} />
  );
};

export const FlowGalleryDefault = Template.bind({});
