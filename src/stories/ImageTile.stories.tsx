import { ImageTile, ImageTileProps } from '../lib';
import { Meta, Story } from '@storybook/react/types-6-0';
import { UnsplashCollectionSource, useUnsplashStatic } from './hooks';

import { ImageItem } from 'lib/types';
import React from 'react';
import { noop } from 'lib/utils';
import styles from './ImageTile.stories.module.scss';

export default {
  title: 'Components/ImageTile',
  component: ImageTile,
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
} as Meta<ImageTileProps>;

const Template: Story<ImageTileProps & { collectionSource: UnsplashCollectionSource }> = ({
  collectionSource,
  ...props
}) => {
  const collection = useUnsplashStatic({ imageCount: 1, collectionSource });
  const [mediaItem] = collection?.items ?? [];
  const item = mediaItem?.item as ImageItem;

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <ImageTile {...props} {...(item ?? {})} />
      </div>
    </div>
  );
};

export const ImageTileDefault = Template.bind({});

export const ImageTileWithStyle = Template.bind({});
ImageTileWithStyle.args = {
  styles: {
    image: styles.image
  }
};

export const ImageTileWithClickHandler = Template.bind({});
ImageTileWithClickHandler.args = {
  onClick: (): void => {
    window.alert('CLICKED!');
  }
};
