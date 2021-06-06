import { GalleryImage, GalleryImageProps } from './GalleryImage';
import React, { FC, memo } from 'react';

import ModuleStyles from './Thumbnail.module.scss';
import clsx from 'clsx';

export type ThumbnailProps = {
  selected?: boolean;
} & GalleryImageProps;

export const Thumbnail: FC<ThumbnailProps> = memo(({ selected, ...galleryImageProps }) => {
  return (
    <GalleryImage
      {...galleryImageProps}
      className={clsx(ModuleStyles.image, {
        [ModuleStyles.selected]: selected === true
      })}
    />
  );
});
