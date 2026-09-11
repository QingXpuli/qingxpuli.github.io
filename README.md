# QingXpuli Blog

一个部署在 GitHub Pages 的静态个人主页与博客，包含 Markdown 文章、项目、音乐歌词、相册和网页互动挂件。

线上地址：[https://qingxpuli.github.io/](https://qingxpuli.github.io/)

## 本地运行

需要 Node.js 22 或更高版本：

```bash
npm ci
npm run dev
```

生产检查（与 CI 中执行的顺序一致）：

```bash
npm run typecheck
npm run lint
npm test
npm run verify:media
NEXT_TELEMETRY_DISABLED=1 npm run build
```

`npm run build` 之后会自动执行 `postbuild`：先生成 `out/sitemap.xml`、`out/feed.xml`、`out/robots.txt`，再校验 404 页面与全部路由产物是否存在；任何一项缺失都会让构建失败。

## 内容更新

- 文章放在 `content/posts/*.md`，文件名就是 URL slug。
- 草稿文章可在 Front Matter 中设置 `draft: true`，不会进入公开站点、sitemap 与 RSS。
- 项目编辑 `content/projects.ts`。
- 相册编辑 `content/gallery.ts`，图片放在 `public/media/`。
- 音乐编辑 `content/music.ts`，音频和 LRC 放在 `public/audio/`。
- 媒体授权登记编辑 `content/media-credits.json`；`npm run verify:media` 会检查每个公开媒体是否登记、文件是否存在、授权字段是否完整。
- 个人信息编辑 `content/site.ts` 与 `content/about.md`。
- 互动挂件文案编辑 `components/companion.tsx`。

音频请只使用你有合法使用权的文件。网易云主页与歌单仅嵌入官方外链播放器并跳转，不抓取、不代理第三方音频，页面也不会自动播放。

## 新增文章与素材

两个脚手架命令负责把"写作"和"素材入库"变得不容易出错：

```bash
# 新建文章（自动写入 front matter，重复 slug 会被拒绝）
npm run new:post -- --title "文章标题" --slug my-post --tags "随笔,记录" --summary "一句话摘要"
npm run new:post -- --title "先存草稿" --slug draft-post --draft

# 素材入库（图片自动转 WebP，并登记 media-credits 条目）
npm run add:media -- --file "C:\photos\me.jpg" --rights owned --author "Qing" \
  --license "站点所有者本人拍摄" --attribution "Qing 本人照片"
npm run add:media -- --file "cover.png" --folder gallery --rights authorized \
  --author "原作者" --license "已获发布许可" --source "https://example.com/source" \
  --attribution "版权归原作者所有"
```

- `--slug` 只接受字母、数字与连字符；纯 ASCII 标题会自动生成 slug，中文标题则回退到 `post-<日期>` 占位并提示你指定 `--slug`。
- `--rights` 必填且必须是 `original` / `owned` / `authorized` 之一；`original` 仅允许站点所有者署名，第三方素材请用 `authorized`。
- 素材入库后运行 `npm run verify:media` 确认门禁通过，再在 `content/` 里引用新路径。
- 文章正文里写 `## 标题` 会自动获得锚点；标题达到 3 个时文章页自动显示目录。

## 媒体授权规则

`content/media-credits.json` 中每个条目都必须包含 `kind`、`path`、`author`、`license`、`sourceUrl`、`attribution`，以及 `rights` 字段：

| `rights` | 含义 | 额外要求 |
| --- | --- | --- |
| `original` | 站点所有者原创 | `author` 必须是站点所有者 |
| `owned` | 站点所有者本人持有的素材（例如个人照片） | 需说明来源与署名 |
| `authorized` | 第三方素材，已获发布许可 | 需说明来源与署名，版权归原作者所有 |

没有明确使用权的资源不得发布；未分类（缺少 `rights`）的素材会直接让 `npm run verify:media` 失败。替换素材后必须同步更新本文件。

## 素材与体积

`npm run optimize:images` 是手动执行的素材维护脚本（不在构建与 CI 中运行）：

- 把 `public/media/` 下超过 1200px 的 PNG/JPEG 转成 WebP（质量 80）并删除原文件；
- 由 `public/media/about-cover.svg` 渲染 `public/media/og-default.png`（1200×630）作为默认社交分享封面。

转换后必须同步更新 `content/gallery.ts`、`content/site.ts` 与 `content/media-credits.json` 中的引用，然后重新运行 `npm run verify:media`。当前 `public/` 总体积约 2.1 MB。

## SEO、sitemap 与 RSS

- 每个页面都有独立的标题、描述与 canonical；文章页额外输出 `og:type=article`、发布时间与标签。
- 默认社交分享图是 `/media/og-default.png`；文章封面为位图（`.jpg/.png/.webp/.avif`）时改用该封面，SVG 封面则回退默认图。
- `out/sitemap.xml`、`out/feed.xml`、`out/robots.txt` 由 `tools/generate-static-meta.mjs` 在构建期生成。
- 站点域名以常量形式写在 `tools/generate-static-meta.mjs` 的 `SITE_URL`、`app/layout.tsx` 的 `siteUrl` 和 `content/site.ts` 的 `blog` 中；更换域名时需要同时修改这三处。

视觉实现参考了沉浸式个人空间的公开设计方向，但本仓库不复制参考站点的源码、图片、文案、字体或品牌元素。歌词同步行为为独立实现，不直接复制 GPL 项目代码。

## GitHub Pages

仓库必须命名为 `qingxpuli.github.io`。工作流会在推送到 `main` 后运行检查、构建并发布 `out`，当前 Pages 来源已设置为 **GitHub Actions**。

评论区使用 Giscus，仓库已启用 Discussions，配置如下：

- 仓库：`QingXpuli/qingxpuli.github.io`
- 仓库 ID：`R_kgDOUIxmTA`
- 分类：`General`
- 分类 ID：`DIC_kwDOUIxmTM4DEgmX`

如果评论区不显示，请确认 [Giscus GitHub App](https://github.com/apps/giscus/installations/new) 已安装到本仓库；安装完成后，文章页会自动显示评论区。
