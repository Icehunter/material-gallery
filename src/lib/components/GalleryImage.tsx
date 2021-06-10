import React, { FC, ImgHTMLAttributes, memo, useMemo, useState } from 'react';

import { CircularProgress } from '@material-ui/core';
import ModuleStyles from './GalleryImage.module.scss';
import { useInView } from 'react-intersection-observer';

export type GalleryImageProps = {
  preload?: boolean;
} & ImgHTMLAttributes<HTMLImageElement>;

export const GalleryImage: FC<GalleryImageProps> = memo(
  ({ src, style, className, preload = false, ...imageElementProps }) => {
    const { ref, inView } = useInView({
      triggerOnce: true,
      rootMargin: '200px'
    });

    const [loading, setLoading] = useState(!preload);

    const imageClassName = className ?? ModuleStyles.image;

    const content = useMemo(() => {
      const placeholder = (
        <div
          className={imageClassName}
          style={{
            ...(style ?? {}),
            border: 'none',
            boxShadow: 'none'
          }}>
          {loading && inView && <CircularProgress size={16} />}
        </div>
      );

      const image = (
        <img
          {...imageElementProps}
          // why can't this be spread? I have no idea
          alt={imageElementProps.alt}
          src={src}
          className={imageClassName}
          role="presentation"
          style={{
            ...(style ?? {}),
            display: loading ? 'none' : 'block'
          }}
          onLoad={(): void => {
            setLoading(false);
          }}
        />
      );

      if (src && (inView || preload)) {
        return (
          <>
            {image}
            {loading && placeholder}
          </>
        );
      }

      return placeholder;
    }, [imageClassName, imageElementProps, inView, loading, preload, src, style]);

    return (
      <div className={ModuleStyles.container} ref={ref}>
        {content}
      </div>
    );
  }
);
