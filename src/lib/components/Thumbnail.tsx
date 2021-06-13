import { GalleryImage, GalleryImageProps } from './GalleryImage';
import React, { FC, memo } from 'react';

import ModuleStyles from './Thumbnail.module.scss';
import clsx from 'clsx';

export type ThumbnailProps = {
  selected?: boolean;
  size?: number;
} & GalleryImageProps;

export const Thumbnail: FC<ThumbnailProps> = memo(({ selected, size = 100, ...galleryImageProps }) => {
  return (
    <GalleryImage
      {...galleryImageProps}
      className={clsx(ModuleStyles.image, {
        [ModuleStyles.selected]: selected === true
      })}
      style={{
        ...(size && {
          height: size,
          width: size
        })
      }}
    />
  );
});
