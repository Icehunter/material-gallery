export type ImageAttribution = {
  name: string;
  avatar: string;
  link: string;
};

export type ImageMeta = {
  thumbnail: string;
  description: string | null;
  likes: number;
  attribution: ImageAttribution;
};

export type Image = {
  src: string;
  raw: string;
  width: number;
  height: number;
  srcSet?: string;
  meta: ImageMeta;
};
