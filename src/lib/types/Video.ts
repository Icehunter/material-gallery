export type VideoAttribution = {
  name: string;
  avatar: string;
  link: string;
};

export type VideoMeta = {
  thumbnail: string;
  description: string | null;
  likes: number;
  attribution: VideoAttribution;
};

export type Video = {
  src: string;
  width: number;
  height: number;
  meta: VideoMeta;
};
