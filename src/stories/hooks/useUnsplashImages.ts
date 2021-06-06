import { useEffect, useState } from 'react';

import { ImageData } from 'lib/types/ImageData';
import { UnsplashExampleData } from 'UnsplashExampleData';

type ExampleData = {
  url: string;
  width: number;
};

export type UseUnsplashImagesProps =
  | {
      imageCount?: number;
      maxDefaultImageWidth?: number;
    }
  | undefined;

export const useUnsplashImages = ({ imageCount = 50, maxDefaultImageWidth = 3840 }: UseUnsplashImagesProps = {}) => {
  const [images, setImages] = useState<ImageData[]>([]);

  useEffect(() => {
    const imageItems: ImageData[] = [];

    for (let i = 0; i < imageCount; i++) {
      const srcSet = UnsplashExampleData[i];

      const examples: ExampleData[] = srcSet.split(',').map((item) => {
        const [url, width] = item.trim().split(' ');
        return {
          url,
          width: parseInt(width.substr(0, width.length - 1))
        };
      });

      let srcURL: string | null = null;
      let thumbnailURL: string | null = null;

      for (let j = examples.length - 1; j >= 0; j--) {
        const example = examples[j];

        // try getting something a larger, but not the largest
        if (!srcURL && example.width <= maxDefaultImageWidth * 2) {
          srcURL = example.url;
        }
        if (!thumbnailURL && example.width <= 400) {
          thumbnailURL = example.url;
        }
      }

      imageItems.push({
        // default to "middle size in srcset" example iamge if we can't find one in range
        src: srcURL ?? examples[Math.floor(examples.length / 2)].url,
        srcSet,
        // default to smallest example iamge if we can't find one in range
        thumbnail: thumbnailURL ?? examples[0].url
      });
    }

    setImages(imageItems);
  }, []);

  return images;
};
