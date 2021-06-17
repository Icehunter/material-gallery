import { Meta, Story } from '@storybook/react/types-6-0';
import { Thumbnail, ThumbnailProps } from '../lib';
import { UnsplashCollectionSource, useUnsplashStatic } from './hooks';
import { collectionSource, themePaletteType } from './argTypes';

import { Image } from 'lib/types';
import React from 'react';
import { noop } from 'lib/utils';

export default {
  title: 'Components/Thumbnail',
  component: Thumbnail,
  args: {
    selected: false,
    onClick: noop,
    collectionSource: UnsplashCollectionSource.Landscape
  },
  argTypes: {
    collectionSource,
    themePaletteType
  },
  parameters: {
    layout: 'fullscreen'
  }
} as Meta<ThumbnailProps>;

const Template: Story<ThumbnailProps & { collectionSource: UnsplashCollectionSource }> = ({
  selected,
  onClick,
  collectionSource
}) => {
  const collection = useUnsplashStatic({ imageCount: 1, targetSize: 200, collectionSource });
  const [mediaItem] = collection?.items ?? [];
  const item = mediaItem?.item as Image;

  const {
    width,
    height,
    meta: { thumbnail }
  } = item;

  return <Thumbnail selected={selected} onClick={onClick} {...{ src: thumbnail, width, height }} />;
};

export const ThumbnailDefault = Template.bind({});

export const ThumbnailWithClickHandler = Template.bind({});
ThumbnailWithClickHandler.args = {
  onClick: (): void => {
    window.alert('CLICKED!');
  }
};
