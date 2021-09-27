import { FlowGallery, FlowGalleryProps } from '../lib';
import { Meta, Story } from '@storybook/react/types-6-0';
import { UnsplashCollectionSource, useUnsplashStatic } from './hooks';
import { collectionSource, imageCount, themePaletteType, zoomScale } from './argTypes';

import React from 'react';

export default {
  title: 'Galleries/FlowGallery',
  component: FlowGallery,
  args: {
    imageCount: 50,
    targetSize: 180,
    padding: 20,
    margin: 5,
    zoomScale: 1,
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
} as Meta<FlowGalleryProps>;

const Template: Story<
  FlowGalleryProps & { imageCount: number; zoomScale: number; collectionSource: UnsplashCollectionSource }
> = ({ zoomScale, targetSize, padding, margin, imageCount, collectionSource }) => {
  const normalizedTargetSize = Math.floor(targetSize * zoomScale);

  const collection = useUnsplashStatic({ imageCount, targetSize: normalizedTargetSize, collectionSource });
  const mediaItems = collection?.items ?? [];

  return <FlowGallery items={mediaItems} targetSize={normalizedTargetSize} padding={padding} margin={margin} />;
};

export const FlowGalleryDefault = Template.bind({});
