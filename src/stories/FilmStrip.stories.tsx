import { FilmStrip, FilmStripProps } from '../lib';
import { Meta, Story } from '@storybook/react/types-6-0';
import { UnsplashCollectionSource, useUnsplashStatic } from './hooks/useUnsplashStatic';
import { useCallback, useRef, useState } from 'react';

import ModuleStyles from './FilmStrip.stories.module.scss';
import { useKeyDownEvent } from 'lib/hooks/useKeyDownEvent';

export default {
  title: 'Components/FilmStrip',
  component: FilmStrip,
  args: {
    imageCount: 50,
    collectionSource: UnsplashCollectionSource.Landscape
  },
  argTypes: {
    imageCount: {
      control: { type: 'range', min: 1, max: 300, step: 1 }
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
} as Meta<FilmStripProps>;

const Template: Story<FilmStripProps & { imageCount: number; collectionSource: UnsplashCollectionSource }> = ({
  imageCount,
  collectionSource
}) => {
  const [selectedItem, setSelectedItem] = useState(0);
  const elementRef = useRef<HTMLDivElement | null>(null);

  const images = useUnsplashStatic({ imageCount, targetSize: 200, collectionSource });

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
      {images.length > 1 && <FilmStrip items={images} selectedItem={selectedItem} setSelectedItem={setSelectedItem} />}
    </div>
  );
};

export const FilmStripDefault = Template.bind({});
