import { useEffect, useMemo, useState } from 'react';

import { VirtualImageItem } from 'lib/types/ImageItem';
import { clamp } from 'lib/utils/math';

const PAGE_SIZE = 100;

type LoremPicsumData = {
  id: string;
  author: string;
  width: number;
  height: number;
  url: string;
  download_url: string;
};

export type TargetType = 'width' | 'height';

export type UseLoremPicsumOptions = {
  imageCount?: number;
  targetSize?: number;
  targetType?: TargetType;
};

export const useLoremPicsum = ({
  imageCount = 5,
  targetSize = 1000,
  targetType = 'height'
}: UseLoremPicsumOptions = {}): VirtualImageItem[] => {
  // because I don't like the first four photos from API :)
  const minimumImageCount = clamp(imageCount + 4, 5, 500);

  const [picsumPhotos, setPicsumPhotos] = useState<LoremPicsumData[]>([]);

  useEffect(() => {
    const resolveImages = async () => {
      const results: LoremPicsumData[] = [];

      const pageCount = Math.ceil(minimumImageCount / PAGE_SIZE);
      for (let i = 1; i <= pageCount; i++) {
        const limit = clamp(minimumImageCount - results.length, 1, PAGE_SIZE);
        try {
          const response = await fetch(`https://picsum.photos/v2/list?page=${i}&limit=${limit}`);
          const [_1, _2, _3, _4, ...rest] = await response.json();
          results.push(...rest);
        } catch (ex) {
          // IGNORED
        }
      }

      setPicsumPhotos(results);
    };

    resolveImages();
  }, [imageCount]);

  const images = useMemo(() => {
    const results: VirtualImageItem[] = [];

    for (let i = 0; i < picsumPhotos.length; i++) {
      const { id, width, height } = picsumPhotos[i];

      const normalizedHeight = targetSize * 2;
      const normalizedWidth = Math.floor((width / height) * normalizedHeight);
      const thumbnailWidth = 200;
      const thumbnailHeight = Math.floor((normalizedHeight / normalizedWidth) * thumbnailWidth);

      results[i] = {
        src: {
          url: `https://picsum.photos/id/${id}/${normalizedWidth}/${normalizedHeight}`,
          width: normalizedWidth,
          height: normalizedHeight
        },
        thumbnail: {
          url: `https://picsum.photos/id/${id}/${thumbnailWidth}/${thumbnailHeight}`,
          width: thumbnailWidth,
          height: thumbnailHeight
        }
      };
    }

    return results;
  }, [imageCount, picsumPhotos]);

  return images;
};
