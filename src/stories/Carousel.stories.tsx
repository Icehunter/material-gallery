import { Carousel, CarouselProps } from '../lib';
import { Meta, Story } from '@storybook/react/types-6-0';
import { UnsplashCollectionSource, useUnsplashStatic } from './hooks';
import { autoplay, collectionSource, delay, imageCount, themePaletteType } from './argTypes';
import { useCallback, useRef, useState } from 'react';

import styles from './Carousel.stories.module.scss';
import { useKeyDownEvent } from '../lib/hooks';

export default {
  title: 'Components/Carousel',
  component: Carousel,
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
} as Meta<CarouselProps>;

const Template: Story<
  CarouselProps & {
    imageCount: number;
    autoplay: boolean;
    delay: number;
    collectionSource: UnsplashCollectionSource;
  }
> = ({ imageCount, autoplay, delay, collectionSource }) => {
  const [selectedItem, setSelectedItem] = useState(0);
  const elementRef = useRef<HTMLDivElement | null>(null);

  const collection = useUnsplashStatic({ imageCount, collectionSource });
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
      <Carousel
        items={mediaItems}
        previousItem={previousItem}
        nextItem={nextItem}
        selectedItem={selectedItem}
        autoplay={autoplay}
        delay={delay}
      />
    </div>
  );
};

export const CarouselDefault = Template.bind({});
