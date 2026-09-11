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

const comicPhotos: GalleryPhoto[] = [
  { src: "/media/gallery/comic-01.webp", alt: "漫画图片一", caption: "喜欢的画面，先收进这里。", date: "2026-09-01" },
  { src: "/media/gallery/comic-02.webp", alt: "漫画图片二", caption: "把偶然看到的片段留下来。", date: "2026-09-01" },
  { src: "/media/gallery/comic-group.webp", alt: "漫画角色合照", caption: "一张值得反复看的合照。", date: "2026-09-01" },
  { src: "/media/gallery/comic-lumingfei.webp", alt: "路明非漫画图片", caption: "角色与故事都在继续。", date: "2026-09-01" },
  { src: "/media/gallery/comic-03.webp", alt: "漫画图片三", caption: "记录一眼心动的构图。", date: "2026-09-01" },
  { src: "/media/gallery/comic-04.webp", alt: "漫画图片四", caption: "留给以后再看的小场景。", date: "2026-09-01" },
  { src: "/media/gallery/comic-lz2-01.webp", alt: "LZ2 漫画图片一", caption: "漫画收藏的一部分。", date: "2026-09-01" },
  { src: "/media/gallery/comic-lz2-02.webp", alt: "LZ2 漫画图片二", caption: "喜欢的线条和色彩。", date: "2026-09-01" },
  { src: "/media/gallery/comic-lz2-03.webp", alt: "LZ2 漫画图片三", caption: "把阅读痕迹保存下来。", date: "2026-09-01" },
  { src: "/media/gallery/comic-lz2-04.webp", alt: "LZ2 漫画图片四", caption: "故事里的一个瞬间。", date: "2026-09-01" },
  { src: "/media/gallery/comic-lz2-05.webp", alt: "LZ2 漫画图片五", caption: "喜欢的画面。", date: "2026-09-01" },
  { src: "/media/gallery/comic-lz2-06.webp", alt: "LZ2 漫画图片六", caption: "继续收集。", date: "2026-09-01" },
  { src: "/media/gallery/comic-lz2-07.webp", alt: "LZ2 漫画图片七", caption: "一页一页留下来。", date: "2026-09-01" },
  { src: "/media/gallery/comic-lz2-08.webp", alt: "LZ2 漫画图片八", caption: "再次打开时仍然喜欢。", date: "2026-09-01" },
  { src: "/media/gallery/comic-lz2-09.webp", alt: "LZ2 漫画图片九", caption: "漫画收藏。", date: "2026-09-01" },
  { src: "/media/gallery/comic-lz2-10.webp", alt: "LZ2 漫画图片十", caption: "阅读中的小片段。", date: "2026-09-01" },
  { src: "/media/gallery/comic-lz2-11.webp", alt: "LZ2 漫画图片十一", caption: "留住喜欢的瞬间。", date: "2026-09-01" },
  { src: "/media/gallery/comic-lz3-01.webp", alt: "LZ3 漫画图片一", caption: "新的收藏。", date: "2026-09-01" },
  { src: "/media/gallery/comic-lz3-02.webp", alt: "LZ3 漫画图片二", caption: "故事还没有结束。", date: "2026-09-01" },
  { src: "/media/gallery/comic-lz3-03.webp", alt: "LZ3 漫画图片三", caption: "把喜欢的东西整理成相册。", date: "2026-09-01" }
];

export const albums: Album[] = [
  {
    slug: "comic-scenes",
    title: "喜欢的画面",
    description: "收集喜欢的漫画画面与角色瞬间。",
    cover: "/media/gallery/comic-group.webp",
    photos: comicPhotos
  }
];
