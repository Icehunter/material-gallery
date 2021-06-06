import { ImageCarousel, ImageCarouselProps } from '../lib';
import { Meta, Story } from '@storybook/react/types-6-0';
import { useCallback, useRef, useState } from 'react';

import { useKeyDownEvent } from '../lib/hooks/useKeyDownEvent';
import { useUnsplashImages } from './hooks/useUnsplashImages';

export default {
  title: 'Galleries/ImageCarousel',
  component: ImageCarousel,
  args: {
    imageCount: 50
  },
  argTypes: {
    imageCount: {
      control: { type: 'range', min: 1, max: 250, step: 1 }
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
        step: 500
      },
      defaultValue: 1500
    }
  },
  parameters: {
    layout: 'fullscreen'
  }
} as Meta<ImageCarouselProps>;

const Template: Story<ImageCarouselProps & { imageCount: number; autoplay: boolean; delay: number }> = ({
  imageCount,
  autoplay,
  delay
}) => {
  const [selectedItem, setSelectedItem] = useState(0);
  const elementRef = useRef<HTMLDivElement | null>(null);

  const images = useUnsplashImages({ imageCount });

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
      <ImageCarousel
        items={images}
        previousItem={previousItem}
        nextItem={nextItem}
        selectedItem={selectedItem}
        autoplay={autoplay}
        delay={delay}
      />
    </div>
  );
};

export const ImageCarouselDefault = Template.bind({});
