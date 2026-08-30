import PostBrowser from "../../components/post-browser";
import { getAllTags, getPosts } from "../../lib/content";

export default function PostsPage() {
  const posts = getPosts();
  return <div className="mx-auto max-w-5xl px-5 pb-20 pt-16"><div className="mb-8"><p className="text-xs uppercase tracking-[.2em] text-[var(--accent)]">Journal</p><h1 className="mt-2 text-4xl font-semibold">文章</h1><p className="mt-3 text-sm text-[var(--muted)]">记录正在学习、正在思考和已经完成的事情。</p></div><PostBrowser posts={posts} tags={getAllTags(posts)} /></div>;
}
