import { Meta, Story } from '@storybook/react/types-6-0';
import { SlideshowGallery, SlideshowGalleryProps } from '../lib';
import { UnsplashCollectionSource, useUnsplashStatic } from './hooks/useUnsplashStatic';
import { useCallback, useRef, useState } from 'react';

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
    <div
      ref={elementRef}
      role="presentation"
      tabIndex={-1}
      style={{
        width: '100%',
        height: '100%',
        outline: 'none'
      }}>
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
    <div
      ref={elementRef}
      role="presentation"
      tabIndex={-1}
      style={{
        width: '50vw',
        height: '50vh',
        outline: 'none',
        padding: '1rem',
        borderRadius: '5px',
        boxShadow: '0 0 5px rgba(0, 0, 0, 0.25)'
      }}>
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

export const SlideshowGalleryDefault = Template.bind({});

export const SlideshowGalleryWithSmallShell = TemplateWithSmallShell.bind({});
SlideshowGalleryWithSmallShell.args = {
  thumbnailSize: 60
};
