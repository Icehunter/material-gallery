import { GalleryImage, GalleryImageProps } from './GalleryImage';
import React, { FC, memo } from 'react';

import { CreateCSSProperties } from '@material-ui/core/styles/withStyles';
import ModuleStyles from './Thumbnail.module.scss';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core';

export type ThumbnailProps = {
  selected?: boolean;
  size?: number;
} & GalleryImageProps;

const useStyles = makeStyles(() => ({
  image: (props: { size: number }): CreateCSSProperties => ({
    width: props.size,
    height: props.size
  })
}));

export const Thumbnail: FC<ThumbnailProps> = memo(({ selected, size = 100, ...galleryImageProps }) => {
  const classes = useStyles({ size });
  return (
    <GalleryImage
      {...galleryImageProps}
      styles={{
        image: clsx(ModuleStyles.image, {
          [ModuleStyles.selected]: selected === true,
          [classes.image]: true
        })
      }}
    />
  );
});
