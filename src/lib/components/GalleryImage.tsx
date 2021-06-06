import React, { CSSProperties, FC, ImgHTMLAttributes, memo, useMemo } from 'react';

import { CircularProgress } from '@material-ui/core';
import ModuleStyles from './GalleryImage.module.scss';
import { noop } from 'lib/utils/noop';
import { useInView } from 'react-intersection-observer';

export type GalleryImageProps = {
  onClick?: () => void;
  style?: CSSProperties;
} & ImgHTMLAttributes<HTMLImageElement>;

export const GalleryImage: FC<GalleryImageProps> = memo(
  ({ src, srcSet, alt, onClick = noop, style = {}, className, ...imageElementProps }) => {
    const { ref, inView } = useInView({ threshold: 0.1 });

    const imageClassName = className ?? ModuleStyles.image;

    const content = useMemo(() => {
      const placeholder = <div className={imageClassName} style={style}></div>;

      if (src) {
        return inView ? (
          <img
            {...imageElementProps}
            src={src}
            srcSet={srcSet}
            className={imageClassName}
            role="presentation"
            alt={alt}
            onClick={onClick}
            style={style}
          />
        ) : (
          placeholder
        );
      }
      return inView ? (
        <div className={imageClassName} style={style}>
          <CircularProgress />
        </div>
      ) : (
        placeholder
      );
    }, [alt, imageClassName, imageElementProps, inView, onClick, src, srcSet, style]);

    return (
      <div className={ModuleStyles.container} ref={ref}>
        {content}
      </div>
    );
  }
);
