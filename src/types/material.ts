export type MaterialType = "video" | "file";
export type ContentTab = "webinars" | "knowledge";

export type Material = {
  id: string;
  title: string;
  description: string;
  type: MaterialType;
  url: string;
  category: string[];
  format: string;
  author: {
    name: string;
    avatar: string;
  };
  duration: number;
  createdAt: Date;
  tab: ContentTab;
};

export type FilterState = {
  topics: string[];
  formats: string[];
  durations: string[];
};
