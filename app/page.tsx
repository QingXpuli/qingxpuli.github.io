import Link from "next/link";
import { ArrowDown, ArrowUpRight, Github, Music2, Tags } from "lucide-react";
import { siteConfig } from "../content/site";
import { projects } from "../content/projects";
import { albums } from "../content/gallery";
import { tracks } from "../content/music";
import { getAllTags, getPosts } from "../lib/content";

export default function HomePage() {
  const posts = getPosts();
  const photos = albums.flatMap((album) => album.photos);
  const tags = getAllTags(posts);
  const track = tracks[0];
  return <>
    <section className="home-hero" aria-labelledby="home-title">
      <div className="home-hero__image" aria-hidden="true" />
      <div className="home-hero__veil" aria-hidden="true" />
      <div className="home-hero__content">
        <p className="eyebrow home-hero__eyebrow">A personal space</p>
        <h1 id="home-title">{siteConfig.displayName}</h1>
        <p>{siteConfig.bio}</p>
        <div className="home-hero__actions">
          <Link className="button-primary focus-ring" href="/posts/">阅读记录 <ArrowUpRight size={16} /></Link>
          <a className="button-secondary focus-ring" href={siteConfig.github} target="_blank" rel="noreferrer"><Github size={16} /> GitHub</a>
        </div>
        <dl className="home-hero__stats"><div><dt>文章</dt><dd>{posts.length}</dd></div><div><dt>照片</dt><dd>{photos.length}</dd></div><div><dt>项目</dt><dd>{projects.length}</dd></div></dl>
      </div>
      <a className="home-hero__scroll focus-ring" href="#notes" aria-label="查看近期记录" title="查看近期记录"><ArrowDown size={19} /></a>
    </section>

    <div className="home-content page-wrap" id="notes">
      <section className="home-stream" aria-labelledby="notes-title">
        <div className="section-heading home-stream__heading"><div><p className="eyebrow">Latest notes</p><h2 id="notes-title">近期记录</h2></div><Link className="section-link focus-ring" href="/posts/">全部文章 <ArrowUpRight size={14} /></Link></div>
        <div className="story-list">
          {posts.map((post, index) => <article className={`story-card glass ${index % 2 ? "story-card--reverse" : ""}`} key={post.slug}>
            <Link className="story-card__cover focus-ring" href={`/posts/${post.slug}/`} tabIndex={-1}><img src={post.cover ?? "/media/post-cover.svg"} alt="" loading={index ? "lazy" : "eager"} /></Link>
            <div className="story-card__body"><div className="story-card__meta"><time dateTime={post.date}>{post.date}</time><span>{post.tags.join(" · ")}</span></div><h3><Link className="focus-ring" href={`/posts/${post.slug}/`}>{post.title}</Link></h3><p>{post.summary}</p><Link className="story-card__link focus-ring" href={`/posts/${post.slug}/`}>阅读全文 <ArrowUpRight size={15} /></Link></div>
          </article>)}
        </div>
      </section>

      <aside className="home-aside" aria-label="站点信息">
        <section className="aside-profile"><img src={siteConfig.avatar} alt={`${siteConfig.author} 头像`} /><div><p className="eyebrow">About</p><h2>{siteConfig.author}</h2><p>学习者、制作者、记录者。</p></div></section>
        <section className="aside-section"><p className="aside-section__label">站点内容</p><dl className="aside-stats"><div><dt>文章</dt><dd>{posts.length}</dd></div><div><dt>照片</dt><dd>{photos.length}</dd></div><div><dt>项目</dt><dd>{projects.length}</dd></div></dl></section>
        <section className="aside-section"><p className="aside-section__label">最近文章</p><div className="aside-list">{posts.slice(0, 4).map((post) => <Link className="focus-ring" href={`/posts/${post.slug}/`} key={post.slug}><span>{post.title}</span><time>{post.date}</time></Link>)}</div></section>
        <section className="aside-section"><p className="aside-section__label"><Tags size={13} /> 标签</p><div className="aside-tags">{tags.map((tag) => <Link className="focus-ring" href={`/posts/?tag=${encodeURIComponent(tag)}`} key={tag}>{tag}</Link>)}</div></section>
        <Link className="aside-now focus-ring" href="/music/"><img src={track.cover} alt="" /><span><small>正在播放</small><strong>{track.title}</strong><em>{track.artist}</em></span><Music2 size={17} aria-hidden="true" /></Link>
        <section className="aside-section"><p className="aside-section__label">友链</p><div className="aside-list">{siteConfig.friends.map((friend) => <a className="focus-ring" href={friend.url} target="_blank" rel="noreferrer" key={friend.url}><span>{friend.name}</span><ArrowUpRight size={14} aria-hidden="true" /></a>)}</div></section>
      </aside>
    </div>
  </>;
}
