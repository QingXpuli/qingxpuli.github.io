export type GalleryPhoto = {
  src: string;
  alt: string;
  caption: string;
  date: string;
};

export type Album = {
  slug: string;
  title: string;
  description: string;
  cover: string;
  photos: GalleryPhoto[];
};

export const albums: Album[] = [
  {
    slug: "first-light",
    title: "第一束光",
    description: "为新站点准备的示例相册，之后可以替换为自己的照片。",
    cover: "/media/gallery-1.svg",
    photos: [
      { src: "/media/gallery-1.svg", alt: "清晨窗边的光线", caption: "从一页空白开始。", date: "2026-08-30" },
      { src: "/media/gallery-2.svg", alt: "桌面上的笔记与植物", caption: "把正在学习的东西放在手边。", date: "2026-08-29" },
      { src: "/media/gallery-3.svg", alt: "夜晚的屏幕与窗", caption: "夜里也可以慢慢整理。", date: "2026-08-28" }
    ]
  },
  {
    slug: "small-scenes",
    title: "小小场景",
    description: "日常片段和还没想好名字的瞬间。",
    cover: "/media/gallery-4.svg",
    photos: [
      { src: "/media/gallery-4.svg", alt: "雨后的街角", caption: "雨停之后，街道颜色更深。", date: "2026-08-27" },
      { src: "/media/gallery-2.svg", alt: "书页和咖啡", caption: "给阅读留一点安静的时间。", date: "2026-08-26" }
    ]
  }
];
