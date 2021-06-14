import { GalleryImage, GalleryImageProps } from '../lib';
import { Meta, Story } from '@storybook/react/types-6-0';
import { UnsplashCollectionSource, useUnsplashStatic } from './hooks/useUnsplashStatic';

import ModuleStyles from './GalleryImage.stories.module.scss';
import React from 'react';
import { noop } from 'lib/utils/noop';

export default {
  title: 'Components/GalleryImage',
  component: GalleryImage,
  args: {
    className: undefined,
    onClick: noop,
    collectionSource: UnsplashCollectionSource.Landscape
  },
  argTypes: {
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
} as Meta<GalleryImageProps>;

const Template: Story<GalleryImageProps & { collectionSource: UnsplashCollectionSource }> = ({
  collectionSource,
  ...props
}) => {
  const [item] = useUnsplashStatic({ imageCount: 1 });

  const { src, width, height } = item ?? {};

  return (
    <GalleryImage
      {...props}
      {...{
        src,
        width,
        height
      }}
    />
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
