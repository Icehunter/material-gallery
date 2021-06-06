import React, { FC, useCallback, useRef, useState } from 'react';

import { SlideshowGallery } from './lib';
import styles from './App.module.scss';
import { useKeyDownEvent } from './lib/hooks/useKeyDownEvent';
import { useUnsplashImages } from 'stories/hooks/useUnsplashImages';

const App: FC = () => {
  const [selectedItem, setSelectedItem] = useState(0);
  const elementRef = useRef<HTMLDivElement | null>(null);

  const items = useUnsplashImages();

  const previousItem = useCallback(() => {
    setSelectedItem((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  }, [items.length]);

  const nextItem = useCallback(() => {
    setSelectedItem((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  }, [items.length]);

  useKeyDownEvent(elementRef, 'ArrowLeft', previousItem);
  useKeyDownEvent(elementRef, 'ArrowRight', nextItem);

  return (
    <div
      ref={elementRef}
      className={styles.container}
      role="presentation"
      tabIndex={-1}
      style={{
        outline: 'none'
      }}>
      <SlideshowGallery
        items={items}
        previousItem={previousItem}
        nextItem={nextItem}
        selectedItem={selectedItem}
        setSelectedItem={setSelectedItem}
      />
    </div>
  );
};

export default App;
