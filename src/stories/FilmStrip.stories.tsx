import { FilmStrip, FilmStripProps } from '../lib';
import { Meta, Story } from '@storybook/react/types-6-0';
import { useRef, useState } from 'react';

import { useUnsplashImages } from './hooks/useUnsplashImages';

export default {
  title: 'Components/FilmStrip',
  component: FilmStrip,
  args: {
    imageCount: 50
  },
  argTypes: {
    imageCount: {
      control: { type: 'range', min: 1, max: 250, step: 1 }
    }
  },
  parameters: {
    layout: 'fullscreen'
  }
} as Meta<FilmStripProps>;

const Template: Story<FilmStripProps & { imageCount: number }> = ({ imageCount }) => {
  const [selectedItem, setSelectedItem] = useState(0);
  const elementRef = useRef<HTMLDivElement | null>(null);

  const images = useUnsplashImages({ imageCount, maxDefaultImageWidth: 200 });

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
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'nowrap',
          justifyContent: 'center',
          alignContent: 'stretch',
          alignItems: 'stretch',
          height: '100%'
        }}>
        {images.length > 1 && (
          <FilmStrip items={images} selectedItem={selectedItem} setSelectedItem={setSelectedItem} />
        )}
      </div>
    </div>
  );
};

export const FilmStripDefault = Template.bind({});
