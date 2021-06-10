import { Meta, Story } from '@storybook/react/types-6-0';
import { Thumbnail, ThumbnailProps } from '../lib';

import React from 'react';
import { noop } from 'lib/utils/noop';
import { useLoremPicsum } from './hooks/useLoremPicsum';

export default {
  title: 'Components/Thumbnail',
  component: Thumbnail,
  args: {
    selected: false,
    onClick: noop
  },
  parameters: {
    layout: 'fullscreen'
  }
} as Meta<ThumbnailProps>;

const Template: Story<ThumbnailProps> = (props) => {
  const [item] = useLoremPicsum({ imageCount: 1, targetSize: 200 });

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%'
      }}>
      <Thumbnail {...props} src={item?.src.url} srcSet={item?.srcSet} />
    </div>
  );
};

export const ThumbnailDefault = Template.bind({});

export const ThumbnailWithClickHandler = Template.bind({});
ThumbnailWithClickHandler.args = {
  onClick: (): void => {
    window.alert('CLICKED!');
  }
};
