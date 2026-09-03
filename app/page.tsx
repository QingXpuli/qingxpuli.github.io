import Link from "next/link";
import { ArrowUpRight, BookOpen, Camera, Code2, Github, Music2 } from "lucide-react";
import FeaturedPost from "../components/featured-post";
import { siteConfig } from "../content/site";
import { projects } from "../content/projects";
import { albums } from "../content/gallery";
import { tracks } from "../content/music";
import { getPosts } from "../lib/content";

export default function HomePage() {
  const posts = getPosts();
  const photos = albums.flatMap((album) => album.photos).slice(0, 3);
  const featuredProjects = projects.filter((project) => project.featured).slice(0, 2);
  const track = tracks[0];
  return <div className="page-wrap pb-20 pt-24 md:pt-28">
    <section className="home-grid">
      <article className="glass home-card home-hero">
        <p className="eyebrow">A small place on the internet</p>
        <h1 className="hero-title">你好，我是 {siteConfig.displayName}。</h1>
        <p className="hero-copy">{siteConfig.bio}</p>
        <div className="hero-actions">
          <Link className="button-primary focus-ring" href="/about/">认识我 <ArrowUpRight size={15} /></Link>
          <a className="button-secondary focus-ring" href={siteConfig.github} target="_blank" rel="noreferrer"><Github size={15} /> GitHub</a>
        </div>
        <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-[.7rem] text-[var(--muted)]">
          <span className="inline-flex items-center gap-1.5"><BookOpen size={14} className="text-[var(--accent)]" />持续记录</span>
          <span className="inline-flex items-center gap-1.5"><Music2 size={14} className="text-[var(--coral)]" />正在听歌</span>
          <span className="inline-flex items-center gap-1.5"><Camera size={14} className="text-[var(--accent)]" />收集片段</span>
        </div>
      </article>

      <aside className="glass home-card home-profile">
        <div className="profile-art">
          <img src="/media/about-cover.svg" alt="" />
          <span className="profile-art__badge">OPEN TO IDEAS</span>
        </div>
        <div className="mt-5 flex items-center gap-3">
          <img className="h-12 w-12 rounded-2xl border-2 border-white/70 object-cover" src={siteConfig.avatar} alt={`${siteConfig.author} 头像`} />
          <div><p className="font-semibold">{siteConfig.author}</p><p className="mt-1 text-xs text-[var(--muted)]">学习者 · 制作者 · 记录者</p></div>
        </div>
        <div className="stat-grid">
          <div className="stat"><strong>{posts.length}</strong><span>文章</span></div>
          <div className="stat"><strong>{photos.length}</strong><span>照片</span></div>
          <div className="stat"><strong>{projects.length}</strong><span>项目</span></div>
        </div>
      </aside>

      <section className="home-wide">
        <div className="section-heading"><div><p className="eyebrow">Selected note</p><h2>精选文章</h2></div><Link className="section-link focus-ring" href="/posts/">全部文章 <ArrowUpRight className="inline" size={14} /></Link></div>
        <FeaturedPost posts={posts} />
      </section>

      <section className="home-side">
        <div className="section-heading"><div><p className="eyebrow" style={{ color: "var(--coral)" }}>Small scenes</p><h2>照片墙</h2></div><Link className="section-link focus-ring" href="/gallery/">查看相册 <ArrowUpRight className="inline" size={14} /></Link></div>
        <div className="glass home-card p-4">
          <div className="photo-strip">{photos.map((photo) => <Link className="photo-tile focus-ring" href="/gallery/" key={photo.src}><img src={photo.src} alt={photo.alt} loading="lazy" /></Link>)}</div>
          <p className="mt-4 text-xs leading-6 text-[var(--muted)]">把日常里值得回看的光线、桌面和街角收集起来。</p>
        </div>
      </section>

      <section className="home-wide">
        <div className="section-heading"><div><p className="eyebrow">Latest notes</p><h2>最近文章</h2></div><Link className="section-link focus-ring" href="/archive/">查看归档 <ArrowUpRight className="inline" size={14} /></Link></div>
        <div className="home-list">{posts.slice(0, 4).map((post) => <Link className="home-list__item focus-ring" href={`/posts/${post.slug}/`} key={post.slug}><p>{post.title}</p><time dateTime={post.date}>{post.date}</time></Link>)}</div>
      </section>

      <section className="home-side">
        <div className="section-heading"><div><p className="eyebrow" style={{ color: "var(--coral)" }}>Soundtrack</p><h2>正在播放</h2></div><Link className="section-link focus-ring" href="/music/">打开音乐页 <ArrowUpRight className="inline" size={14} /></Link></div>
        <Link className="glass home-card flex items-center gap-4 p-4 transition hover:-translate-y-1" href="/music/">
          <img className="h-20 w-20 rounded-2xl object-cover" src={track.cover} alt="" />
          <div className="min-w-0"><p className="eyebrow" style={{ color: "var(--coral)" }}>First signal</p><h3 className="mt-2 truncate font-semibold">{track.title}</h3><p className="mt-1 truncate text-xs text-[var(--muted)]">{track.artist}</p><p className="mt-3 text-xs text-[var(--muted)]">歌词、进度和播放状态都在音乐页。</p></div>
        </Link>
      </section>

      <section className="home-wide">
        <div className="section-heading"><div><p className="eyebrow">Selected work</p><h2>精选项目</h2></div><Link className="section-link focus-ring" href="/projects/">全部项目 <ArrowUpRight className="inline" size={14} /></Link></div>
        <div className="grid gap-3 sm:grid-cols-2">{featuredProjects.map((project) => <Link className="glass home-card project-tile focus-ring" href={project.demoUrl ?? project.repoUrl} target={project.demoUrl ? undefined : "_blank"} rel={project.demoUrl ? undefined : "noreferrer"} key={project.title}><img src={project.cover} alt="" /><div className="project-tile__body"><div className="flex items-center justify-between gap-3"><h3>{project.title}</h3><Code2 size={15} className="shrink-0 text-[var(--accent)]" /></div><p>{project.summary}</p></div></Link>)}</div>
      </section>

      <section className="home-side">
        <div className="section-heading"><div><p className="eyebrow" style={{ color: "var(--coral)" }}>Around the web</p><h2>友情链接</h2></div></div>
        <div className="grid gap-2">{siteConfig.friends.map((friend) => <a className="friend-link focus-ring" href={friend.url} target="_blank" rel="noreferrer" key={friend.url}><span><strong className="block text-[var(--ink)]">{friend.name}</strong><small className="mt-1 block text-[.66rem]">{friend.description}</small></span><ArrowUpRight size={15} /></a>)}</div>
      </section>
    </section>
  </div>;
}
