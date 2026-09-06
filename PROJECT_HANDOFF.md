# QingXpuli GitHub Pages 项目交接总结

> 用途：供后续对话、维护任务或新的代码代理快速接续本项目。本文以当前仓库和最近一次部署状态为准。

## 1. 项目身份

- 项目目录：`C:\Users\typ\Desktop\New for codex\qingxpuli.github.io`
- GitHub 仓库：`https://github.com/QingXpuli/qingxpuli.github.io`
- 线上站点：`https://qingxpuli.github.io/`
- 部署方式：GitHub Pages + GitHub Actions
- 主分支：`main`
- 应用代码基线：`1bfded6 feat: redesign personal site experience`
- 基线远端状态：`main` 与 `origin/main` 一致；本次新增的 `PROJECT_HANDOFF.md` 当前尚未提交
- 最近成功部署：Actions 运行 `33941506669`
  - 地址：`https://github.com/QingXpuli/qingxpuli.github.io/actions/runs/33941506669`

这是一个没有仓库路径的 GitHub 个人站点，仓库名必须保持为 `qingxpuli.github.io`。以后可以再通过 GitHub Pages 设置绑定独立域名，但当前没有配置独立域名。

## 2. 项目目标与设计方向

目标是一个属于 QingXpuli 的个人主页与博客，包含学习记录、项目、音乐歌词、照片墙和轻量互动。

视觉完成度参考了两个公开站点的设计方向：

- `heiehiehi.github.io`：沉浸式首屏、文章内容流、桌面信息侧栏和工具密度。
- `xmyl-153.github.io/xingmengyouling-blog/`：动态背景、蒙版、毛玻璃和点击反馈氛围。

只借鉴信息架构、视觉层次、交互逻辑和氛围方向。禁止复制参考站点的 HTML、CSS、JavaScript、DOM 结构、文字、图片、字体、Live2D 模型或第三方 CDN 资源。歌词同步逻辑也是本项目独立实现，不直接复制其他仓库代码。

当前视觉规则：

- 首屏使用深绿色背景、绿色强调色和珊瑚色辅助色，避免单一色系统治页面。
- 首屏背景是仓库内 QingXpuli 的原创演示 SVG，通过 CSS 动态构图和蒙版展示。
- 首页首屏之后是文章主流和桌面信息侧栏；移动端改为单列。
- 卡片和主要表面圆角控制在 8px 以内；按钮和头像等特殊控件可以使用圆形。
- 不使用装饰性渐变球、光斑堆叠、参考站素材或 Live2D。
- 需要保持清晰对比度、无横向滚动、无文字遮挡、无控件重叠和可见焦点状态。

## 3. 技术栈与构建方式

- Next.js 16，App Router，静态导出。
- React 19，TypeScript，Tailwind CSS v4（通过 `@tailwindcss/postcss`）。
- `lucide-react`：按钮和导航图标。
- `gray-matter`：读取 Markdown Front Matter。
- `unified`、`remark-parse`、`remark-gfm`、`remark-html`：Markdown 转 HTML。
- `vitest`：单元测试。
- Node.js 22 或更高版本。

关键配置：

- `next.config.ts` 设置 `output: "export"`、`trailingSlash: true` 和 `images.unoptimized: true`。
- `npm run build` 输出 `out/`；`postbuild` 会运行 `tools/prepare-pages.mjs`，把 `out/404/index.html` 复制成根目录 `out/404.html`。
- GitHub Actions 工作流是 `.github/workflows/pages.yml`，推送到 `main` 后执行检查、构建并发布 `out/`。

常用命令：

```bash
npm ci
npm run dev
npm run typecheck
npm run lint
npm test
npm run verify:media
NEXT_TELEMETRY_DISABLED=1 npm run build
```

## 4. 页面和路由

当前必须保留的静态路由：

| 路由 | 用途 |
| --- | --- |
| `/` | 沉浸式首页、文章流、侧栏、首屏统计 |
| `/posts/` | 文章列表和标签筛选 |
| `/posts/first-note/` | 示例文章：从一页空白开始 |
| `/posts/build-log/` | 示例文章：把复杂功能拆成可维护的小块 |
| `/posts/night-walk/` | 示例文章：夜间散步的观察记录 |
| `/archive/` | 文章归档 |
| `/projects/` | 项目列表 |
| `/about/` | 个人介绍和记录痕迹 |
| `/music/` | 音乐播放器、歌词和歌单 |
| `/gallery/` | 相册和照片灯箱 |
| 自定义 404 | `app/not-found.tsx`，导出后同时存在 `out/404.html` |

## 5. 已实现功能

### 首页与导航

- 全屏沉浸式 Hero，H1 为 `QingXpuli`。
- 首屏包含简介、文章入口、 GitHub 入口、文章/照片/项目统计和下滑入口。
- 首页导航初始透明，滚动后变为固定毛玻璃顶栏。
- 桌面端显示导航、右侧工具栏和侧栏；移动端使用右侧抽屉导航。
- 抽屉打开时锁定 `body` 滚动，支持关闭、路由跳转和移动端主题切换。

### 文章与搜索

- 文章以 `content/posts/*.md` 管理，文件名即 slug。
- 支持 `title`、`date`、`summary`、`tags`、`cover`、`draft` Front Matter。
- `lib/content.ts` 会规范化日期、过滤草稿并按日期倒序排列。
- 首页文章卡片封面左右交替，包含日期、标签、摘要和阅读入口。
- `components/site-search.tsx` 提供本地搜索层，搜索标题、摘要和标签。
- 搜索支持输入聚焦、上下方向键、Enter、Escape 关闭、空结果状态和关闭后的焦点恢复。

### 音乐和歌词

- `components/music-context.tsx` 统一维护音频、当前曲目、播放状态、进度和歌词状态。
- `components/music-page.tsx` 提供封面、进度条、上一首/播放/下一首、同步歌词和歌单。
- `components/mini-player.tsx` 在非音乐页显示迷你播放器。
- `lib/lrc.ts` 独立解析 LRC 时间戳，并根据播放时间计算当前歌词。
- 当前只有一首演示音轨：`First Signal`，对应 `public/audio/demo.wav` 和 `public/audio/demo.lrc`。
- 网易云地址只用于“查看来源链接”跳转，不抓取或代理第三方音频。

### 照片墙和互动

- `components/gallery-lightbox.tsx` 支持缩略图、灯箱、上一张、下一张、Escape 关闭、背景滚动锁定和关闭后焦点恢复。
- 图片加载失败时显示“图片暂不可用”占位状态。
- `components/companion.tsx` 是原创互动挂件，点击后随机显示提示语，可收起/展开。
- `components/click-feedback.tsx` 使用 Canvas 绘制点击环和粒子反馈，并尊重 `prefers-reduced-motion`。
- `components/theme-toggle.tsx` 使用 `localStorage` 持久化浅色/深色主题。
- `components/giscus-comments.tsx` 在文章页按路径挂载 Giscus 评论区。

### 背景与视觉组件

- `components/background-stage.tsx` 轮播三张仓库内 SVG 背景，并叠加明暗主题蒙版和色彩 wash。
- `app/globals.css` 负责响应式布局、Hero、文章卡片、侧栏、毛玻璃、主题、动画和焦点样式。
- 所有图标优先使用 `lucide-react`。

## 6. 内容和资产维护

### 内容入口

- 个人信息和友链：`content/site.ts`
- 个人介绍：`content/about.md`
- 文章：`content/posts/*.md`
- 项目：`content/projects.ts`
- 相册：`content/gallery.ts`
- 音乐和 LRC 路径：`content/music.ts`
- 媒体授权登记：`content/media-credits.json`
- 互动挂件文案：`components/companion.tsx`

### 当前演示内容

- 3 篇示例文章。
- 2 个示例项目：`New for Codex` 和 `Limbus Lyric Simulator`。
- 2 个相册，共 5 张示例照片。
- 1 首 `First Signal` 示例音轨，约 12 秒。
- `public/media/` 中的 SVG 和 `public/audio/` 中的 WAV/LRC 都是 QingXpuli 的演示占位素材。

### 媒体授权规则

`tools/verify-media-credits.mjs` 会检查：

1. `public/` 下每个公开媒体是否在 `content/media-credits.json` 登记。
2. 登记项是否包含合法的 `kind`、`path`、`author` 和 `license`。
3. 本地路径对应文件是否存在。

替换图片、音频、歌词或字体时，必须同步填写作者、许可证、来源和署名；没有明确使用权的资源不得发布。当前头像是 QingXpuli GitHub 头像远程地址，并已在媒体清单中说明。

## 7. Giscus 配置

文章评论区使用 Giscus：

- repo：`QingXpuli/qingxpuli.github.io`
- repoId：`R_kgDOUIxmTA`
- category：`General`
- categoryId：`DIC_kwDOUIxmTM4DEgmX`
- mapping：`pathname`
- language：`zh-CN`

如果评论区不显示，先确认 Giscus GitHub App 已安装到该仓库，并确认仓库 Discussions 已启用。该项属于外部服务前置条件，不是静态构建错误。

## 8. 已验证证据

最近一次重构和圆角修正已经完成以下验证：

- `npm ci`：CI 已执行通过。
- `npm run typecheck`：通过。
- `npm run lint`：通过。
- `npm test`：通过，`lib/content.test.ts` 共 2 个测试通过。
- `npm run verify:media`：通过，12 项媒体登记通过。
- `NEXT_TELEMETRY_DISABLED=1 npm run build`：通过，静态路由全部生成。
- `out/index.html`、`out/404.html`、各主要路由的 `index.html` 均存在。
- Edge/Chromium `1440x900`：首屏、下一分区、滚动顶栏、工具栏和无横向溢出通过。
- Edge/Chromium `390x844`：移动布局、抽屉导航、滚动锁定、主题、搜索和无横向溢出通过。
- 真实点击验证：回到顶部、Canvas 点击反馈、音乐播放和时间推进、歌词高亮、灯箱前后切换/Escape、互动挂件状态变化。
- 线上主要路由 `/`、`/posts/`、`/archive/`、`/projects/`、`/about/`、`/music/`、`/gallery/` 均返回 `200`。
- 线上不存在的路径返回 `404`。
- 最近 GitHub Pages Actions：`33941506669` 成功。

浏览器验收曾保存的代表性截图位于系统临时目录：

- `C:\Users\typ\AppData\Local\Temp\qingxpuli-qa-final-online-desktop-fresh.png`
- `C:\Users\typ\AppData\Local\Temp\qingxpuli-qa-final-desktop-lightbox.png`
- `C:\Users\typ\AppData\Local\Temp\qingxpuli-qa-final-mobile-music.png`

## 9. 当前未完成项与可选后续

当前重构目标没有未完成的代码或部署项。以下是内容层面的可选后续，不应误判为现有功能缺陷：

1. 用真实文章替换 `content/posts/` 中的三篇示例文章。
2. 用本人有合法使用权的照片替换 `public/media/` 和 `content/gallery.ts` 中的演示素材。
3. 用本人有合法使用权的音频和 LRC 替换 `demo.wav`、`demo.lrc` 及 `content/music.ts`。
4. 将 `content/projects.ts` 中的示例项目摘要、仓库和封面替换为真实项目资料。
5. 按需完善 `content/site.ts` 的个人简介、友链和头像。
6. 如需评论，完成 Giscus GitHub App 安装；如需独立域名，再配置 Pages 自定义域名和 DNS。

替换真实内容后必须重新运行媒体审计、构建、浏览器验收并重新推送部署。

## 10. 后续对话接续规则

开始任何新任务前：

1. 进入 `C:\Users\typ\Desktop\New for codex\qingxpuli.github.io`。
2. 先运行 `git status --short --branch`，保留用户已有修改，不要使用 `git reset --hard` 或 `git checkout --` 覆盖内容。
3. 先阅读本文件、`README.md` 和相关组件，再决定是否改代码。
4. 只修改与当前请求有关的文件；不要复制参考站点资源。
5. 任何新增公开媒体都先登记 `content/media-credits.json`。
6. 修改后至少运行与风险相称的检查；涉及页面或交互时使用 Edge/Chromium browser-harness 做真实验收。
7. 只有用户明确要求发布时才推送；发布前确认构建、媒体审计和工作区状态。

可直接交给后续对话的接续提示词：

```text
请继续维护 C:\Users\typ\Desktop\New for codex\qingxpuli.github.io。
先阅读 PROJECT_HANDOFF.md 和 README.md，检查 git status，不要覆盖用户已有修改。
当前线上站点是 https://qingxpuli.github.io/，当前 main 与 origin/main 在提交 1bfded6。
保留现有页面结构、音乐/LRC、照片墙灯箱、搜索、主题、点击反馈、互动挂件、Giscus 和媒体授权审计。
不要复制 heiehiehi.github.io 或 xmyl-153.github.io 的源码、资源、文案、字体或 Live2D。
根据本次具体需求修改，并按文档中的检查和部署约束验证。
```
