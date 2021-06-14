import React, { FC, useCallback, useRef, useState } from 'react';

import { CssBaseline } from '@material-ui/core';
import { SlideshowGallery } from './lib';
import styles from './App.module.scss';
import { useKeyDownEvent } from './lib/hooks/useKeyDownEvent';
import { useUnsplashStatic } from 'stories/hooks/useUnsplashStatic';

const App: FC = () => {
  const [selectedItem, setSelectedItem] = useState(0);
  const elementRef = useRef<HTMLDivElement | null>(null);

  const images = useUnsplashStatic();

  const previousItem = useCallback(() => {
    setSelectedItem((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const nextItem = useCallback(() => {
    setSelectedItem((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  useKeyDownEvent(elementRef, 'ArrowLeft', previousItem);
  useKeyDownEvent(elementRef, 'ArrowRight', nextItem);

  return (
    <>
      <CssBaseline />
      <div
        ref={elementRef}
        className={styles.container}
        role="presentation"
        tabIndex={-1}
        style={{
          outline: 'none'
        }}>
        <SlideshowGallery
          items={images}
          previousItem={previousItem}
          nextItem={nextItem}
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
        />
      </div>
    </>
  );
};

export default App;
