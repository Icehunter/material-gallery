import React, { FC, memo } from 'react';

import { CreateCSSProperties } from '@material-ui/core/styles/withStyles';
import { GalleryImage } from '../GalleryImage';
import { ImageItem } from 'lib/types/ImageItem';
import ModuleStyles from './ImageTile.module.scss';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core';

export type ImageTileProps = {
  item: ImageItem;
  key: string;
  height: number;
  width: number;
  margin: number;
};

const useStyles = makeStyles(() => ({
  image: (props: Pick<ImageTileProps, 'width' | 'height' | 'margin'>): CreateCSSProperties => ({
    width: props.width,
    height: props.height,
    margin: props.margin
  })
}));

export const ImageTile: FC<ImageTileProps> = memo(({ item, key, height, width, margin }) => {
  const classes = useStyles({ width, height, margin });

  return (
    <GalleryImage
      key={key}
      src={item.src}
      srcSet={item.srcSet}
      styles={{
        image: clsx(ModuleStyles.image, {
          [classes.image]: true
        })
      }}
    />
  );
});
