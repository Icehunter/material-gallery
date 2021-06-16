import { FlowGallery, FlowGalleryProps } from '../lib';
import { Meta, Story } from '@storybook/react/types-6-0';
import { UnsplashCollectionSource, useUnsplashStatic } from './hooks';
import { collectionSource, imageCount, themePaletteType, zoomLevel } from './argTypes';

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
    collectionSource,
    imageCount,
    themePaletteType,
    zoomLevel
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
