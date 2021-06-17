import { animalsPhotos, landscapePhotos, naturePhotos } from 'stories/samples';

import { Image } from 'lib/types';
import { MediaCollection } from 'lib/types/MediaCollection';
import { MediaType } from 'lib/types/MediaType';
import { UnsplashAPIResponse } from 'stories/types/UnsplashAPIResponse';
import { clamp } from 'lib/utils';
import { useMemo } from 'react';

export enum UnsplashCollectionSource {
  Animals = 'Animals',
  Landscape = 'Landscape',
  Nature = 'Nature'
}

export enum TargetType {
  Width = 'Width',
  Height = 'Height',
  Thumbnail = 'Thumbnail'
}

export type UseUnsplashStaticOptions = {
  imageCount?: number;
  targetSize?: number;
  targetType?: TargetType;
  collectionSource?: UnsplashCollectionSource;
};

export const useUnsplashStatic = ({
  imageCount = 5,
  targetSize = 500,
  targetType = TargetType.Height,
  collectionSource = UnsplashCollectionSource.Landscape
} = {}): MediaCollection<Image> => {
  const normalizedImageCount = clamp(imageCount, 1, 300);

  const collection: UnsplashAPIResponse[] = useMemo(() => {
    switch (collectionSource) {
      case UnsplashCollectionSource.Animals:
        return animalsPhotos;
      case UnsplashCollectionSource.Landscape:
        return landscapePhotos;
      case UnsplashCollectionSource.Nature:
        return naturePhotos;
    }
  }, [collectionSource]);

  const images = useMemo(() => {
    const results: MediaCollection<Image> = {
      items: []
    };

    for (let imageIndex = 0; imageIndex < normalizedImageCount; imageIndex++) {
      const {
        width,
        height,
        alt_description,
        urls: { raw, small },
        likes,
        user: {
          name,
          profile_image: { small: smallProfileImage },
          links: { html: userProfileLink }
        }
      } = collection[imageIndex];

      let normalizedWidth = width;
      let normalizedHeight = height;

      switch (targetType) {
        case TargetType.Height:
          normalizedHeight = targetSize;
          normalizedWidth = Math.floor((width / height) * normalizedHeight);
          break;
        case TargetType.Width:
          normalizedWidth = targetSize;
          normalizedHeight = Math.floor((height / width) * normalizedWidth);
          break;
      }

      let sizeQueryString = '';
      switch (targetType) {
        case TargetType.Thumbnail:
        case TargetType.Height:
          sizeQueryString = `h=${targetSize * 1.5}`;
          break;
        case TargetType.Width:
          sizeQueryString = `w=${targetSize * 1.5}`;
          break;
      }

      const image: Image = {
        // setup for retina displays/4k
        src: `${raw}&fm=jpg&q=80&${sizeQueryString}`,
        raw,
        width: normalizedWidth,
        height: normalizedHeight,
        meta: {
          thumbnail: small,
          description: alt_description,
          likes,
          attribution: {
            name,
            avatar: smallProfileImage,
            link: userProfileLink
          }
        }
      };

      results.items[imageIndex] = {
        type: MediaType.Image,
        item: image
      };
    }

    return results;
  }, [normalizedImageCount, collection, targetType, targetSize]);

  return images;
};
