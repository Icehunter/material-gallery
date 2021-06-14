import { AnimalsPhotos } from 'stories/samples/AnimalPhotos';
import { LandscapePhotos } from 'stories/samples/LandscapePhotos';
import { NaturePhotos } from 'stories/samples/NaturePhotos';
import { UnsplashAPIResponse } from 'stories/types/UnsplashAPIResponse';
import { VirtualImageItem } from 'lib/types/ImageItem';
import { clamp } from 'lib/utils/math';
import { useMemo } from 'react';

export enum UnsplashCollectionSource {
  Animals = 'Animals',
  Landscape = 'Landscape',
  Nature = 'Nature'
}

export enum TargetType {
  Width,
  Height,
  Thumbnail
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
} = {}): VirtualImageItem[] => {
  const normalizedImageCount = clamp(imageCount, 1, 300);

  const collection: UnsplashAPIResponse[] = useMemo(() => {
    switch (collectionSource) {
      case UnsplashCollectionSource.Animals:
        return AnimalsPhotos;
      case UnsplashCollectionSource.Landscape:
        return LandscapePhotos;
      case UnsplashCollectionSource.Nature:
        return NaturePhotos;
    }
  }, [collectionSource]);

  const images = useMemo(() => {
    const results: VirtualImageItem[] = [];

    for (let i = 0; i < normalizedImageCount; i++) {
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
      } = collection[i];

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

      results[i] = {
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
    }

    return results;
  }, [normalizedImageCount, collection, targetType, targetSize]);

  return images;
};
