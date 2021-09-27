import { FilmStrip, FilmStripProps } from '../lib';
import { Meta, Story } from '@storybook/react/types-6-0';
import { UnsplashCollectionSource, useUnsplashStatic } from './hooks';
import { collectionSource, imageCount, themePaletteType } from './argTypes';
import { useCallback, useRef, useState } from 'react';

import styles from './FilmStrip.stories.module.scss';
import { useKeyDownEvent } from 'lib/hooks';

export default {
  title: 'Components/FilmStrip',
  component: FilmStrip,
  args: {
    imageCount: 50,
    collectionSource: UnsplashCollectionSource.Landscape
  },
  argTypes: {
    imageCount,
    collectionSource,
    themePaletteType
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

  const collection = useUnsplashStatic({ imageCount, targetSize: 200, collectionSource });
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
      {mediaItems.length > 1 && (
        <FilmStrip items={mediaItems} selectedItem={selectedItem} setSelectedItem={setSelectedItem} />
      )}
    </div>
  );
};

export const FilmStripDefault = Template.bind({});
