export type ImageItemAttribution = {
  name: string;
  avatar: string;
  link: string;
};

export type ImageItemMeta = {
  thumbnail: string;
  description: string | null;
  likes: number;
  attribution: ImageItemAttribution;
};

export type ImageItem = {
  src: string;
  raw: string;
  width: number;
  height: number;
  srcSet?: string;
  meta: ImageItemMeta;
};

export type VirtualImageItem = ImageItem | undefined;
