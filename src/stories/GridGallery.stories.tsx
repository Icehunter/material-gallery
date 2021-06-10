import { GridGallery, GridGalleryProps } from '../lib';
import { Meta, Story } from '@storybook/react/types-6-0';

import React from 'react';
import { useLoremPicsum } from './hooks/useLoremPicsum';

export default {
  title: 'Galleries/GridGallery',
  component: GridGallery,
  args: {
    imageCount: 50,
    zoomLevel: 0,
    targetSize: 180,
    padding: 20,
    margin: 5
  },
  argTypes: {
    imageCount: {
      control: { type: 'range', min: 1, max: 500, step: 1 }
    },
    zoomLevel: {
      control: { type: 'range', min: -5, max: 5, step: 1 }
    }
  },
  parameters: {
    layout: 'fullscreen'
  }
} as Meta<GridGalleryProps>;

const Template: Story<GridGalleryProps & { imageCount: number; zoomLevel: number }> = ({
  zoomLevel,
  targetSize,
  padding,
  margin,
  imageCount
}) => {
  const images = useLoremPicsum({ imageCount, targetSize: targetSize });

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
