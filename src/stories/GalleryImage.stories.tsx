import { GalleryImage, GalleryImageProps } from '../lib';
import { Meta, Story } from '@storybook/react/types-6-0';

import ModuleStyles from './GalleryImage.stories.module.scss';
import React from 'react';
import { noop } from 'lib/utils/noop';
import { useUnsplashImages } from './hooks/useUnsplashImages';

export default {
  title: 'Components/GalleryImage',
  component: GalleryImage,
  args: {
    className: undefined,
    onClick: noop
  },
  parameters: {
    layout: 'fullscreen'
  }
} as Meta<GalleryImageProps>;

const Template: Story<GalleryImageProps> = (props) => {
  const [item] = useUnsplashImages({ imageCount: 5 });

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%'
      }}>
      <GalleryImage {...props} src={item?.src} srcSet={item?.srcSet} />
    </div>
  );
};

export const GalleryImageDefault = Template.bind({});

export const GalleryImageWithStyle = Template.bind({});
GalleryImageWithStyle.args = {
  className: ModuleStyles.image
};

export const GalleryImageWithClickHandler = Template.bind({});
GalleryImageWithClickHandler.args = {
  onClick: (): void => {
    window.alert('CLICKED!');
  }
};
