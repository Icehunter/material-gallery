export type ImageItemAttribution = {
  name: string;
  avatar: string;
  link: string;
};

export type ImageItemMeta = {
  /**
   * thumbnail component will use this directly should be matched to the size (default 72px)
   * additionally the image is not aready square, account for "cover" css and the increased size
   * you may want to increase the size to 200px as a minimum for both
   */
  thumbnail: string;
  description: string | null;
  likes: number;
  attribution: ImageItemAttribution;
};

export type ImageItem = {
  /** default primary source for all images */
  src: string;
  raw: string;
  width: number;
  height: number;
  /** source set list of url's for browser to determine the right picture */
  srcSet?: string;
  meta: ImageItemMeta;
};

export type VirtualImageItem = ImageItem | undefined;
