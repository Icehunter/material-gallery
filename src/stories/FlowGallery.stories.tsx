import { FlowGallery, FlowGalleryProps } from '../lib';
import { Meta, Story } from '@storybook/react/types-6-0';
import { UnsplashCollectionSource, useUnsplashStatic } from './hooks/useUnsplashStatic';

import React from 'react';

export default {
  title: 'Galleries/FlowGallery',
  component: FlowGallery,
  args: {
    imageCount: 50,
    zoomLevel: 0,
    targetHeight: 180,
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
> = ({ zoomLevel, targetHeight, padding, margin, imageCount, collectionSource }) => {
  const images = useUnsplashStatic({ imageCount, targetSize: targetHeight, collectionSource });

  return (
    <div
      style={{
        width: '100%',
        height: '100%'
      }}>
      <FlowGallery items={images} zoomLevel={zoomLevel} targetHeight={targetHeight} padding={padding} margin={margin} />
    </div>
  );
};

export const FlowGalleryDefault = Template.bind({});
