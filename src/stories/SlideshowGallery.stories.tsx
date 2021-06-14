import { Meta, Story } from '@storybook/react/types-6-0';
import { SlideshowGallery, SlideshowGalleryProps } from '../lib';
import { UnsplashCollectionSource, useUnsplashStatic } from './hooks/useUnsplashStatic';
import { useCallback, useRef, useState } from 'react';

import ModuleStyles from './Slideshow.stories.module.scss';
import { useKeyDownEvent } from '../lib/hooks/useKeyDownEvent';
import { useRect } from 'lib/hooks/useRect';

export default {
  title: 'Galleries/SlideshowGallery',
  component: SlideshowGallery,
  args: {
    imageCount: 50,
    collectionSource: UnsplashCollectionSource.Landscape
  },
  argTypes: {
    imageCount: {
      control: { type: 'range', min: 1, max: 300, step: 1 }
    },
    autoplay: {
      type: 'boolean',
      defaultValue: false
    },
    delay: {
      control: {
        type: 'range',
        min: 1000,
        max: 10000,
        step: 300
      },
      defaultValue: 1500
    },
    collectionSource: {
      defaultValue: UnsplashCollectionSource.Landscape,
      control: {
        type: 'select',
        options: Object.keys(UnsplashCollectionSource)
      }
    }
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

  const images = useUnsplashStatic({ imageCount, targetSize: rect.height, collectionSource });

  const previousItem = useCallback(() => {
    setSelectedItem((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const nextItem = useCallback(() => {
    setSelectedItem((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  useKeyDownEvent(elementRef, 'ArrowLeft', previousItem);
  useKeyDownEvent(elementRef, 'ArrowRight', nextItem);

  return (
    <div className={ModuleStyles.container} ref={elementRef} role="presentation" tabIndex={-1}>
      <SlideshowGallery
        {...args}
        items={images}
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

  const images = useUnsplashStatic({ imageCount, targetSize: rect.height, collectionSource });

  const previousItem = useCallback(() => {
    setSelectedItem((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const nextItem = useCallback(() => {
    setSelectedItem((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  useKeyDownEvent(elementRef, 'ArrowLeft', previousItem);
  useKeyDownEvent(elementRef, 'ArrowRight', nextItem);

  return (
    <div className={ModuleStyles.containerSmall} ref={elementRef} role="presentation" tabIndex={-1}>
      <div className={ModuleStyles.wrapperSmall}>
        <SlideshowGallery
          {...args}
          items={images}
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
