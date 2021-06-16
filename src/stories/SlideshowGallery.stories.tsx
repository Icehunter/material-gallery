import { Meta, Story } from '@storybook/react/types-6-0';
import { SlideshowGallery, SlideshowGalleryProps } from '../lib';
import { UnsplashCollectionSource, useUnsplashStatic } from './hooks';
import { autoplay, collectionSource, delay, imageCount, themePaletteType } from './argTypes';
import { useCallback, useRef, useState } from 'react';

import styles from './Slideshow.stories.module.scss';
import { useKeyDownEvent } from '../lib/hooks';
import { useRect } from 'lib/hooks';

export default {
  title: 'Galleries/SlideshowGallery',
  component: SlideshowGallery,
  args: {
    imageCount: 50,
    collectionSource: UnsplashCollectionSource.Landscape
  },
  argTypes: {
    autoplay,
    collectionSource,
    delay,
    imageCount,
    themePaletteType
  },
  parameters: {
    layout: 'fullscreen'
  }
} as Meta<SlideshowGalleryProps>;

const Template: Story<
  SlideshowGalleryProps & {
    imageCount: number;
    autoplay: boolean;
    delay: number;
    collectionSource: UnsplashCollectionSource;
  }
> = ({ imageCount, autoplay, delay, collectionSource, ...args }) => {
  const elementRef = useRef<HTMLDivElement | null>(null);

  const [selectedItem, setSelectedItem] = useState(0);

  const rect = useRect(elementRef);

  const collection = useUnsplashStatic({ imageCount, targetSize: Math.floor(rect.height), collectionSource });
  const mediaItems = collection?.items ?? [];

  const previousItem = useCallback(() => {
    setSelectedItem((prev) => (prev === 0 ? mediaItems.length - 1 : prev - 1));
  }, [mediaItems.length]);

  const nextItem = useCallback(() => {
    setSelectedItem((prev) => (prev === mediaItems.length - 1 ? 0 : prev + 1));
  }, [mediaItems.length]);

  useKeyDownEvent(elementRef, 'ArrowLeft', previousItem);
  useKeyDownEvent(elementRef, 'ArrowRight', nextItem);

  return (
    <div className={styles.container} ref={elementRef} role="presentation" tabIndex={-1}>
      <SlideshowGallery
        {...args}
        items={mediaItems}
        previousItem={previousItem}
        nextItem={nextItem}
        selectedItem={selectedItem}
        setSelectedItem={setSelectedItem}
        autoplay={autoplay}
        delay={delay}
      />
    </div>
  );
};

const TemplateWithSmallShell: Story<
  SlideshowGalleryProps & {
    imageCount: number;
    autoplay: boolean;
    delay: number;
    collectionSource: UnsplashCollectionSource;
  }
> = ({ imageCount, autoplay, delay, collectionSource, ...args }) => {
  const elementRef = useRef<HTMLDivElement | null>(null);

  const [selectedItem, setSelectedItem] = useState(0);

  const rect = useRect(elementRef);

  const collection = useUnsplashStatic({ imageCount, targetSize: Math.floor(rect.height), collectionSource });
  const mediaItems = collection?.items ?? [];

  const previousItem = useCallback(() => {
    setSelectedItem((prev) => (prev === 0 ? mediaItems.length - 1 : prev - 1));
  }, [mediaItems.length]);

  const nextItem = useCallback(() => {
    setSelectedItem((prev) => (prev === mediaItems.length - 1 ? 0 : prev + 1));
  }, [mediaItems.length]);

  useKeyDownEvent(elementRef, 'ArrowLeft', previousItem);
  useKeyDownEvent(elementRef, 'ArrowRight', nextItem);

  return (
    <div className={styles.containerSmall} ref={elementRef} role="presentation" tabIndex={-1}>
      <div className={styles.wrapperSmall}>
        <SlideshowGallery
          {...args}
          items={mediaItems}
          previousItem={previousItem}
          nextItem={nextItem}
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
          autoplay={autoplay}
          delay={delay}
        />
      </div>
    </div>
  );
};

export const SlideshowGalleryDefault = Template.bind({});

export const SlideshowGalleryWithSmallShell = TemplateWithSmallShell.bind({});
SlideshowGalleryWithSmallShell.args = {
  thumbnailSize: 60
};
