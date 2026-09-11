import type { Metadata } from "next";
import PostBrowser from "../../components/post-browser";
import { getAllTags, getPosts } from "../../lib/content";

export const metadata: Metadata = {
  title: "文章",
  description: "QingXpuli 的学习记录、技术笔记与日常随笔，可按标签筛选。",
  alternates: { canonical: "/posts/" }
};

export default function PostsPage() {
  const posts = getPosts();
  return <div className="page-wrap page-intro pb-20"><div className="mb-8"><p className="eyebrow">Journal</p><h1>文章</h1><p>记录正在学习、正在思考和已经完成的事情。</p></div><PostBrowser posts={posts} tags={getAllTags(posts)} /></div>;
}
