import React, { FC, memo } from 'react';

import { CreateCSSProperties } from '@material-ui/core/styles/withStyles';
import { ImageItem } from 'lib/types/ImageItem';
import { ImageTile } from '../ImageTile';
import ModuleStyles from './MasonryImageTile.module.scss';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core';

export type MasonryImageTileProps = {
  item: ImageItem;
  height: number;
  width: number;
  margin: number;
};

const useStyles = makeStyles(() => ({
  image: (props: Pick<MasonryImageTileProps, 'width' | 'height' | 'margin'>): CreateCSSProperties => ({
    width: props.width,
    height: props.height,
    margin: props.margin
  })
}));

export const MasonryImageTile: FC<MasonryImageTileProps> = memo(({ item, height, width, margin }) => {
  const classes = useStyles({ width, height, margin });

  return (
    <ImageTile
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
