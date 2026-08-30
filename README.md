# QingXpuli Blog

一个部署在 GitHub Pages 的静态个人主页与博客，包含 Markdown 文章、项目、音乐歌词、相册和网页互动挂件。

## 本地运行

需要 Node.js 22 或更高版本：

```bash
npm ci
npm run dev
```

生产检查：

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

## 内容更新

- 文章放在 `content/posts/*.md`，文件名就是 URL slug。
- 草稿文章可在 Front Matter 中设置 `draft: true`，不会进入公开站点。
- 项目编辑 `content/projects.ts`。
- 相册编辑 `content/gallery.ts`，图片放在 `public/media/`。
- 音乐编辑 `content/music.ts`，音频和 LRC 放在 `public/audio/`。
- 个人信息编辑 `content/site.ts` 与 `content/about.md`。
- 互动挂件文案编辑 `components/companion.tsx`。

音频请只使用你有合法使用权的文件。网易云主页链接仅用于来源说明和跳转，不使用非官方 API 抓取或代理音频。

## GitHub Pages

仓库必须命名为 `qingxpuli.github.io`。工作流会在推送到 `main` 后运行检查、构建并发布 `out`。仓库设置中的 Pages 来源选择 **GitHub Actions**。

Giscus 需要先在仓库设置中启用 Discussions、创建评论分类并安装 Giscus GitHub App；配置完成后再把公开的仓库与分类 ID 写入评论组件。
