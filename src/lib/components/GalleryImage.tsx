import React, { CSSProperties, FC, ImgHTMLAttributes, memo, useMemo, useState } from 'react';

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

    const [loading, setLoading] = useState(true);

    const imageClassName = className ?? ModuleStyles.image;

    const content = useMemo(() => {
      const placeholder = (
        <div className={imageClassName} style={style}>
          {loading && <CircularProgress />}
        </div>
      );

      const image = (
        <img
          {...imageElementProps}
          src={src}
          srcSet={srcSet}
          className={imageClassName}
          role="presentation"
          alt={alt}
          onClick={onClick}
          style={{
            ...(style ?? {}),
            display: loading ? 'none' : 'block'
          }}
          onLoad={(): void => {
            setLoading(false);
          }}
        />
      );

      if (src && inView) {
        return (
          <>
            {image}
            {loading && placeholder}
          </>
        );
      }

      return placeholder;
    }, [alt, imageClassName, imageElementProps, inView, loading, onClick, src, srcSet, style]);

    return (
      <div className={ModuleStyles.container} ref={ref}>
        {content}
      </div>
    );
  }
);
