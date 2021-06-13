import React, { FC, ImgHTMLAttributes, memo, useMemo, useState } from 'react';

import { CSSProperties } from '@material-ui/core/styles/withStyles';
import { CircularProgress } from '@material-ui/core';
import ModuleStyles from './GalleryImage.module.scss';
import { useInView } from 'react-intersection-observer';

export type GalleryImageProps = {
  preload?: boolean;
  progressContainerStyles?: CSSProperties;
} & ImgHTMLAttributes<HTMLImageElement>;

export const GalleryImage: FC<GalleryImageProps> = memo(
  ({ src, style, className, preload = false, progressContainerStyles, ...imageElementProps }) => {
    const { ref, inView } = useInView({
      triggerOnce: true,
      rootMargin: '200px'
    });

    const [loading, setLoading] = useState(true);

    const imageClassName = className ?? ModuleStyles.image;

    const content = useMemo(() => {
      const placeholder = (
        <div
          className={imageClassName}
          style={{
            ...(style ?? {}),
            ...(progressContainerStyles ?? {})
          }}>
          {loading && inView && (
            <CircularProgress
              size={16}
              style={{
                display: 'flex',
                padding: '10px',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            />
          )}
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
            ...(loading ? { display: 'none' } : undefined)
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
    }, [imageClassName, imageElementProps, inView, loading, preload, progressContainerStyles, src, style]);

    return (
      <div className={ModuleStyles.container} ref={ref}>
        {content}
      </div>
    );
  }
);
