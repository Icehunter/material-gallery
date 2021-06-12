import { MasonryGallery, MasonryGalleryDirection, MasonryGalleryProps } from '../lib';
import { Meta, Story } from '@storybook/react/types-6-0';

import React from 'react';
import { useLoremPicsum } from './hooks/useLoremPicsum';

export default {
  title: 'Galleries/MasonryGallery',
  component: MasonryGallery,
  args: {
    imageCount: 50,
    zoomLevel: 0,
    targetSize: 320,
    padding: 20,
    margin: 5,
    direction: MasonryGalleryDirection.Vertical
  },
  argTypes: {
    imageCount: {
      control: { type: 'range', min: 1, max: 500, step: 1 }
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
    }
  },
  parameters: {
    layout: 'fullscreen'
  }
} as Meta<MasonryGalleryProps>;

const Template: Story<MasonryGalleryProps & { imageCount: number; zoomLevel: number }> = ({
  zoomLevel,
  targetSize,
  padding,
  margin,
  imageCount,
  direction
}) => {
  const images = useLoremPicsum({ imageCount, targetSize: targetSize });

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
