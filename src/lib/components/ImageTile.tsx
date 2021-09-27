import React, { FC, ImgHTMLAttributes, memo, useMemo, useState } from 'react';

import { CircularProgress } from '@material-ui/core';
import ModuleStyles from './ImageTile.module.scss';
import clsx from 'clsx';
import { noop } from '../utils';
import { useInView } from 'react-intersection-observer';

export type ImageTileStyles = {
  root?: string;
  image?: string;
  loader?: string;
};

export type ImageTileProps = {
  width: number;
  height: number;
  /**
   * Styles to be applied to the various nodes in the dom tree; will override defaults
   */
  styles?: ImageTileStyles;
  preload?: boolean;
} & ImgHTMLAttributes<HTMLImageElement>;

export const ImageTile: FC<ImageTileProps> = memo(
  ({ height, width, styles = {}, src, alt, preload = false, onClick = noop, ...imageElementProps }) => {
    const { ref, inView } = useInView({
      triggerOnce: true,
      rootMargin: '200px'
    });

    const [loading, setLoading] = useState(true);

    const rootClass = clsx(ModuleStyles.root, { [styles.root ?? '']: true });
    const imageClass = clsx(ModuleStyles.image, { [styles.image ?? '']: true });
    const loaderClass = clsx(ModuleStyles.loader, { [styles.loader ?? '']: true });

    const placeholder = useMemo(
      () => (
        <div className={clsx(imageClass, { [loaderClass]: true })}>
          {loading && inView && <CircularProgress size={16} />}
        </div>
      ),
      [imageClass, inView, loaderClass, loading]
    );

    const image = useMemo(
      () => (
        <img
          {...imageElementProps}
          width={width}
          height={height}
          src={src}
          className={imageClass}
          style={{
            ...(loading ? { display: 'none' } : undefined)
          }}
          onLoad={(): void => {
            setLoading(false);
          }}
          alt={alt}
        />
      ),
      [alt, height, imageClass, imageElementProps, loading, src, width]
    );

    const content = useMemo(() => {
      if (src && (inView || preload)) {
        return (
          <>
            {image}
            {loading && placeholder}
          </>
        );
      }

      return placeholder;
    }, [image, inView, loading, placeholder, preload, src]);

    return (
      <div className={rootClass} ref={ref} role="presentation" onClick={onClick}>
        {content}
      </div>
    );
  }
);
