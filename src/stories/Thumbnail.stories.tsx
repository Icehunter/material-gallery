import { Meta, Story } from '@storybook/react/types-6-0';
import { Thumbnail, ThumbnailProps } from '../lib';
import { UnsplashCollectionSource, useUnsplashStatic } from './hooks/useUnsplashStatic';

import { ImageItem } from 'lib/types/ImageItem';
import React from 'react';
import { noop } from 'lib/utils/noop';

export default {
  title: 'Components/Thumbnail',
  component: Thumbnail,
  args: {
    selected: false,
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
} as Meta<ThumbnailProps>;

const Template: Story<ThumbnailProps & { collectionSource: UnsplashCollectionSource }> = ({
  collectionSource,
  ...props
}) => {
  const [item] = useUnsplashStatic({ imageCount: 1, targetSize: 200, collectionSource });

  const {
    width,
    height,
    meta: { thumbnail }
  } = item as ImageItem;

  return <Thumbnail {...props} {...{ src: thumbnail, width, height }} />;
};

export const ThumbnailDefault = Template.bind({});

export const ThumbnailWithClickHandler = Template.bind({});
ThumbnailWithClickHandler.args = {
  onClick: (): void => {
    window.alert('CLICKED!');
  }
};
