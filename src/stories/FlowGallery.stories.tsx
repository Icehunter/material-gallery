import { FlowGallery, FlowGalleryProps } from '../lib';
import { Meta, Story } from '@storybook/react/types-6-0';

import React from 'react';
import { useLoremPicsum } from './hooks/useLoremPicsum';

export default {
  title: 'Galleries/FlowGallery',
  component: FlowGallery,
  args: {
    imageCount: 50,
    zoomLevel: 0,
    targetHeight: 180,
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
} as Meta<FlowGalleryProps>;

const Template: Story<FlowGalleryProps & { imageCount: number; zoomLevel: number }> = ({
  zoomLevel,
  targetHeight,
  padding,
  margin,
  imageCount
}) => {
  const images = useLoremPicsum({ imageCount, targetSize: targetHeight });

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
