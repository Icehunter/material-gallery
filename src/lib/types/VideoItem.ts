export type VideoItemAttribution = {
  name: string;
  avatar: string;
  link: string;
};

export type VideoItemMeta = {
  thumbnail: string;
  description: string | null;
  likes: number;
  attribution: VideoItemAttribution;
};

export type VideoItem = {
  src: string;
  width: number;
  height: number;
  meta: VideoItemMeta;
};

export type VirtualVideoItem = VideoItem | undefined;
