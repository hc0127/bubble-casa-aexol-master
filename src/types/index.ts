export interface BubbleNode {
  id: number;
  name: string;
  name_second?: null | string;
  bg_color?: BgColor;
  text_color?: TextColor;
  accent_color?: AccentColor;
  image?: string;
  tags?: string[];
  keywords?: string[] | null;
  position?: number;
  status?: number;
  allow_to_post?: number;
  editors_pick?: number;
  show_video_only?: number;
  news?: number;
  news_delay_to_delete?: number;
  thumbnails?: number;
  premium?: number;
  advanced?: number;
  expert?: number;
  standard?: number;
  is_popular?: number;
  is_half_image?: number;
  include_article?: number;
  child?: {
    child: BubbleNode[];
  };
}

export enum AccentColor {
  D6274D = "#d6274d",
  The000000 = "#000000",
}

export enum BgColor {
  D3D3D3 = "#d3d3d3",
  F0F0F0 = "#f0f0f0",
  F2F0F0 = "#f2f0f0",
  F2F2F2 = "#f2f2f2",
  F5F5F5 = "#f5f5f5",
  F7F7F7 = "#f7f7f7",
  Fafafa = "#fafafa",
  Fcfcfc = "#fcfcfc",
}

export enum TextColor {
  The000000 = "#000000",
  The29537D = "#29537d",
}

export interface Position {
  x: number;
  y: number;
}

export interface Tag {
  tag: string;
  id: string;
}

export type DataResponse<T> = {
  data: T;
};

export interface ChildIndex {
  id: number;
  index: number;
}
export interface PanToFunctionProps {
  position: Position;
  id: number;
}

export interface PanToFunction {
  (props: PanToFunctionProps): void;
}
