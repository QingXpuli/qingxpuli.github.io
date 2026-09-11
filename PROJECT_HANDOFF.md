# QingXpuli GitHub Pages 项目方案与进度审计

> 用途：供后续对话、维护任务或新的代码代理快速接续本项目。
> 本版在 2026-09-11 的 P0+P1 加固完成后重写，记录加固内容、验证证据与剩余待办。上一版（同日）是加固前的审计版本。

---

## 0. 进度总览

| 维度 | 计划 | 现状 | 状态 |
| --- | --- | --- | --- |
| 仓库与分支 | 公开仓库 `qingxpuli.github.io`，`main` | 已建成 | ✅ 完成 |
| 部署链路 | GitHub Pages + 官方 Actions | `build_type: workflow`、`https_enforced: true` | ✅ 完成 |
| 页面与路由 | 7 个栏目 + 文章详情 + 自定义 404 | 构建产物 13 个静态页面 | ✅ 完成 |
| 核心交互 | 搜索、主题、音乐/歌词、灯箱、挂件、点击反馈 | 全部存在 | ✅ 完成 |
| 自动播放策略 | 禁止自动播放 | 网易云 iframe 全部 `auto=0` | ✅ 完成（本轮修复） |
| 媒体授权治理 | 有明确使用权的素材才可发布 | `rights` 字段强制分类；20 张第三方漫画按"已获授权"如实登记 | ✅ 完成（本轮） |
| 每页元数据 / SEO | 计划包含 | 每页独立标题/描述/canonical + OG/Twitter；文章 `og:type=article` | ✅ 完成（本轮） |
| sitemap / robots / RSS | 计划包含 | 构建期生成 `sitemap.xml`（10 URL）、`feed.xml`（3 item）、`robots.txt` | ✅ 完成（本轮） |
| 代码高亮 / 文章目录 | 计划包含 | rehype 管线 + `.hljs` 主题；标题自动加锚点，标题 ≥3 时渲染目录 | ✅ 完成（本轮） |
| 工程卫生 | 无死脚本、无多余依赖 | 死脚本已实现为真实工具；`zod`/`next-themes` 已移除 | ✅ 完成（本轮） |
| 素材体积 | 可接受的移动端加载 | `public/` 6.50 MB → 2.10 MB | ✅ 完成（本轮） |
| 真实内容替换 | 真实文章/项目/音频 | 文章 3 篇、项目 2 个、音轨 1 首仍为示例 | 🟡 未开始（P2） |
| Giscus 应用安装 | 评论区可用 | 组件与配置就绪，App 安装状态无法用 gh 凭据确认 | ⚠️ 待人工确认 |

## 1. 项目身份

- 项目目录：`C:\Users\typ\Desktop\New for codex\qingxpuli.github.io`
- 仓库：`https://github.com/QingXpuli/qingxpuli.github.io`（public、`has_discussions: true`、无 LICENSE）
- 线上站点：`https://qingxpuli.github.io/`
- 部署方式：GitHub Pages + GitHub Actions，主分支 `main`
- Pages 配置：`build_type: workflow`、`cname: null`（无独立域名）、`custom_404: false`、`https_enforced: true`
- 应用代码基线：`a8b643e feat: add per-page metadata, sitemap, feed and code highlighting`（本轮 P0+P1 加固的最后一个代码提交）
- 最近成功部署：Actions run `34560717685`（2026-09-11，success，node24 actions），此前 `34559916458`、`34559733474` 亦成功
- 推送通道状态（本机网络）：`github.com` 的 DNS 结果（如 `20.205.243.166`）被黑洞，`git push` 报 "Failed to connect" 或 "Connection was reset"，但其他 GitHub 边缘 IP 正常，且**可达集合在数秒内变化**。可靠做法是运行 `pwsh -File "C:\Users\typ\Desktop\New for codex\push-github.ps1"`：它先用 `git ls-remote` 逐个探测边缘 IP，再用 `git -c http.curloptResolve=github.com:443:<ip> push` 推送，失败自动换下一个 IP。已验证可用（本轮 `9b096e5..35f3f87` 就是走它推送的），不需要改 hosts、不需要管理员权限。
- 备用推送通道：`api.github.com` 始终可达，可用 Git Data API 逐字节重放提交（已验证 SHA 与原提交完全一致）。首次推送即用它完成。
- 长期方案：SSH over 443 —— `ssh.github.com:443` 可以完成 SSH 握手，只需在账号注册 SSH 公钥，然后把远端改成 `ssh://git@ssh.github.com:443/QingXpuli/qingxpuli.github.io.git`；或启用 VPN/代理后直接 `git push`。

这是没有仓库路径的 GitHub 个人站点，仓库名必须保持 `qingxpuli.github.io`。

## 2. 项目目标与设计边界（不变）

目标是属于 QingXpuli 的个人主页与博客：学习记录、项目、音乐歌词、照片墙和轻量互动。

视觉完成度参考 `heiehiehi.github.io`（沉浸式首屏、内容流、侧栏）与 `xmyl-153.github.io/xingmengyouling-blog/`（动态背景、蒙版、毛玻璃、点击反馈）的方向。**禁止**复制参考站点的 HTML、CSS、JavaScript、DOM 结构、文字、图片、字体、Live2D 模型或第三方 CDN 资源；歌词同步逻辑为独立实现。

视觉规则：首屏深绿 + 绿色强调 + 珊瑚辅助；卡片圆角 ≤ 8px；不使用装饰性渐变球、光斑堆叠、参考站素材或 Live2D；保持对比度、无横向滚动、无文字遮挡、无控件重叠、可见焦点状态。

## 3. 技术栈、构建与工具

**运行时依赖**：Next.js 16（App Router，静态导出）、React 19、TypeScript、Tailwind CSS v4、`lucide-react`、`gray-matter`、`unified` + `remark-parse` + `remark-gfm` + `remark-rehype` + `rehype-slug` + `rehype-highlight` + `rehype-stringify`。
**开发依赖**：`vitest`、`sharp`（仅素材脚本使用）、ESLint、TypeScript。

**关键配置**：`next.config.ts` 使用 `output: "export"`、`trailingSlash: true`、`images.unoptimized: true`，不设 `basePath`。

**脚本**：

```bash
npm run dev
npm run typecheck          # tsc --noEmit
npm run lint               # eslint
npm test                   # vitest run
npm run verify:media       # 媒体授权门禁
npm run generate:meta      # 手动生成 out/{sitemap.xml,feed.xml,robots.txt}（需先 build）
npm run optimize:images    # 手动压缩素材 + 渲染 og-default.png
NEXT_TELEMETRY_DISABLED=1 npm run build
```

`postbuild` = `generate-static-meta.mjs` → `prepare-pages.mjs`：前者生成 sitemap/feed/robots，后者复制 `out/404/index.html` 到 `out/404.html` 并断言 11 个关键产物存在，缺一即让构建失败。

**工具**：

| 文件 | 作用 |
| --- | --- |
| `tools/verify-media-credits.mjs` | 媒体授权门禁：登记完整性、文件存在、`rights` 分类合法、`original` 必须由站点所有者署名 |
| `tools/generate-static-meta.mjs` | 生成 sitemap/feed/robots；导出纯函数供单测 |
| `tools/prepare-pages.mjs` | 404 复制 + 产物门禁 |
| `tools/optimize-images.mjs` | 手动：WebP 压缩 + 渲染 `og-default.png` |
| `tools/make-demo-audio.mjs` | 生成演示音轨 |

**为什么 sitemap/RSS 用构建脚本而不是 `app/sitemap.ts` / route handler**：`output: "export"` 下元数据路由与 Route Handler 的构建期支持依赖框架内部行为，而构建期脚本确定、可单测、与本仓库既有 `tools/*.mjs` 模式一致。

## 4. 页面、路由与产物

| 路由 | 用途 |
| --- | --- |
| `/` | 沉浸式首页、文章流、侧栏、统计 |
| `/posts/` | 文章列表与标签筛选 |
| `/posts/<slug>/` | 文章正文、代码高亮、目录（≥3 个标题时）、Giscus |
| `/archive/` | 文章归档 |
| `/projects/` | 项目列表 |
| `/about/` | 个人介绍与记录痕迹 |
| `/music/` | 音乐：网易云官方外链播放器 + 本地同步歌词音轨 |
| `/gallery/` | 相册、灯箱与版权说明 |
| `/404.html` | 自定义 404 |
| `/sitemap.xml`、`/feed.xml`、`/robots.txt` | 构建期生成（不在仓库树中） |

## 5. 已实现功能（按模块）

**首页与导航**：全屏 Hero（H1 = QingXpuli）、简介、入口、统计；滚动后固定毛玻璃顶栏；桌面导航 + 右侧工具栏 + 侧栏；移动端抽屉导航并锁定 `body` 滚动。

**文章、归档与搜索**：`content/posts/*.md`，文件名即 slug，支持 `title`/`date`/`summary`/`tags`/`cover`/`draft`；`lib/content.ts` 过滤草稿、按日期倒序、渲染 Markdown（GFM + 代码高亮 + 标题锚点）并返回 `{ html, headings }`；`components/site-search.tsx` 本地搜索标题/摘要/标签，支持键盘操作与焦点恢复。

**音乐与歌词**：`components/music-context.tsx` 统一维护音频/曲目/进度/歌词；`lib/lrc.ts` 解析 LRC。桌面端（≥1024px）为"音乐馆"：单个网易云官方外链播放器（`auto=0`）、可切换 3 首歌、上一首/下一首/随机选曲、外链跳转，外加本地 `demo.wav` + `demo.lrc` 的逐句同步歌词舞台；移动端为旧版布局，歌单内每首歌一个官方 iframe，同样 `auto=0`。**全站不自动播放。**

**照片墙与互动**：灯箱（上一张/下一张/Escape/滚动锁定/焦点恢复/加载失败占位）；原创互动挂件；Canvas 点击反馈（尊重 `prefers-reduced-motion`）；`localStorage` 主题；Giscus 评论区按 pathname 挂载；相册页含一行版权说明。

## 6. 内容与素材现状

| 内容位 | 计划 | 现状 |
| --- | --- | --- |
| 文章 | 真实文章 | 3 篇示例（仍是示例，P2） |
| 项目 | 真实项目 | 2 个示例，其中一个指向他人仓库（P2，建议改为灵感来源或删除） |
| 照片 | 本人有权素材 | 1 个相册"喜欢的画面"，20 张第三方漫画图，已获发布许可并如实登记 |
| 头像 | 本人头像 | `/media/avatar.webp`（1.29 MB → 31 KB） |
| 音频 / LRC | 本人有权音频 | 仍为 `demo.wav` / `demo.lrc`（P2） |
| 个人简介 / 友链 | 按需完善 | 已填 |
| 独立域名 | 可选 | 未配置（`cname: null`） |

素材格式：20 张相册图 + 头像已转为 WebP（最大边 1200px、质量 80），`public/` 由 6.50 MB 降至 2.10 MB。旧 PNG/JPEG 仍存在于 git 历史中，本轮不重写历史。

## 7. 媒体授权规则

`content/media-credits.json`（33 条）中每个条目包含 `kind`、`path`、`author`、`license`、`sourceUrl`、`attribution`、`rights`：

| `rights` | 含义 | 门禁要求 |
| --- | --- | --- |
| `original` | 站点所有者原创 | `author` 必须是站点所有者（`Qing` / `QingXpuli`） |
| `owned` | 站点所有者本人持有（如个人照片/头像） | 需 `sourceUrl` 与 `attribution` |
| `authorized` | 第三方素材，已获发布许可 | 需 `sourceUrl` 与 `attribution`，页面标注版权归原作者 |

未分类或字段缺失会直接让 `npm run verify:media` 失败——这是本轮加固的核心护栏：**旧版清单只校验字段是否存在，因此把第三方漫画署名成站点所有者也能通过**。

当前 20 张漫画图登记为 `author: "第三方漫画素材（权利方未标注）"`、`license: "站点所有者确认持有公开发布权；版权归原作者所有"`、`rights: "authorized"`。若日后补充到真实作品名与作者，请更新这三条字段与 `attribution`。

## 8. 本轮验证证据（2026-09-11）

- `npm run typecheck`、`npm run lint` → exit 0
- `npm test` → exit 0，17 个测试通过（`lib/content.test.ts` 8 个：LRC、草稿过滤、排序、标签、代码高亮、未标注语言不猜测、标题 id 与顺序、无标题；`tools/generate-static-meta.test.mjs` 9 个：sitemap 路由与尾斜杠、XML 转义、feed item/绝对链接/RFC822、空列表、robots、路径工具、草稿过滤与排序、缺失目录）
- `npm run verify:media` → exit 0，33 条登记通过
- `npm run build` → exit 0，13 个静态页面；postbuild 报告 `sitemap.xml (10 urls), feed.xml (3 items), robots.txt` 与 `11 artifacts present`
- 构建产物检查：`out/sitemap.xml` 含 7 条静态路由 + 3 篇文章（均带尾斜杠、文章带 `lastmod`）；`out/feed.xml` 含 3 个 item、绝对链接与 RFC822 日期；`out/robots.txt` 含 `Sitemap:` 行
- 首页 HTML：`og:title`/`og:description`/`og:url`/`og:site_name`/`og:locale`/`og:image`(+width/height/alt)/`twitter:card`/`link rel=canonical` 全部存在
- 文章页 HTML：`<title>从一页空白开始 | QingXpuli 的小窝</title>`，含 `og:type=article`、`article:published_time`、`article:tag`；`<h2 id="为什么做一个个人站点">` 锚点存在
- TOC 端到端验证：临时文章（含 h2/h2/h3 三个标题）构建后 `out/posts/toc-check/index.html` 出现 `class="post-toc"` 且锚点与标题 id 一致；验证后删除临时文章并重建，产物与 sitemap 回到 10 条 URL
- 音乐页：`auto=0` × 3（无自动播放）
- 相册页：图片引用全部为 `.webp`，且页面包含版权说明
- 素材：`public/` 2.10 MB；`optimize-images` 报告 21 个文件 6131 KB → 1593 KB，`og-default.png` 41 KB

**尚未验证**：Giscus GitHub App 是否已安装（`gh api /user/installations` 返回 403，需要 App 授权令牌）；浏览器视觉验收（本轮以构建产物与线上探针为依据）。

## 9. 原计划验收标准对照

| 验收标准 | 结论 |
| --- | --- |
| 线上可访问、无仓库路径 | ✅ |
| 页面刷新不 404 | ✅ |
| 无 API 密钥、无服务端接口 | ✅ |
| TypeScript/Lint/测试/构建通过 | ✅ |
| 音乐、歌词、相册、挂件在桌面与移动端可用 | 🟡 代码与构建就绪，未复跑浏览器验收 |
| 禁止自动播放 | ✅ 本轮修复 |
| 减少动态效果与键盘操作 | ✅ |
| 素材可替换且无不明版权来源 | ✅ 本轮加固（`rights` 分类 + 相册页说明） |
| Actions 推送后自动部署 | ✅ |
| 不复制参考项目代码与素材 | ✅ |
| 每页独立元数据 / OG | ✅ 本轮补齐 |
| sitemap / RSS | ✅ 本轮补齐 |
| 代码高亮 / 文章目录 | ✅ 本轮补齐 |

## 10. 本轮提交

| # | 提交主题 | 内容 |
| --- | --- | --- |
| 1 | P0 风险修复 | 移动端网易云 iframe `auto=1` → `auto=0`；20 张漫画图授权如实登记；相册页版权说明；媒体门禁新增 `rights` 分类 |
| 2 | SEO、sitemap、robots、RSS | 每页 `metadata`、文章 `generateMetadata`、OG/Twitter/canonical、`og-default.png`、`tools/generate-static-meta.mjs` + 单测、`postbuild` 串联与产物门禁 |
| 3 | 代码高亮与目录 | `remark-rehype`/`rehype-slug`/`rehype-highlight` 管线、标题收集插件、`renderMarkdown` 返回 `{ html, headings }`、文章页目录与 `.hljs` 主题 |
| 4 | 依赖与素材治理 | 移除 `zod`/`next-themes`；实现 `tools/optimize-images.mjs`（sharp）；21 个位图转 WebP，`public/` 6.50 MB → 2.10 MB，同步引用与媒体清单 |
| 5 | 文档 | 本文件与 `README.md` 更新 |

部署：Actions run `34559733474` 成功（build 与 deploy 两个 job 均通过），线上核验结果：

- 10 条页面路由 + `/sitemap.xml` + `/feed.xml` + `/robots.txt` + `/404.html` + `/media/gallery/comic-01.webp` + `/media/og-default.png` 全部 `200`；`/posts/does-not-exist/` 返回 `404`
- 线上 sitemap 10 条 `<url>`，feed 3 条 `<item>`
- 线上首页含完整 `og:*`（含 1200×630 的 `og:image`）、`twitter:card` 与 `link rel=canonical`；各栏目标题分别为"关于 | …""归档 | …""项目 | …""音乐 | …""照片墙 | …""文章 | …"
- 线上文章页：`<title>从一页空白开始 | QingXpuli 的小窝</title>`，含 `og:type=article`、`article:published_time`、两个 `article:tag`，正文标题带锚点 `id="为什么做一个个人站点"`
- 线上相册页：20 个 `.webp` 引用，版权说明存在
- 线上音乐页：`auto=0` × 3，无自动播放
- `og-default.png` 实际尺寸 1200×630

## 11. 剩余待办

**P2 内容层（需要你提供素材，本轮未做）**

1. 用真实文章替换 `content/posts/` 的 3 篇示例。
2. 替换 `demo.wav` / `demo.lrc` 与 `content/music.ts` 中的演示音轨。
3. 修正 `content/projects.ts`：其中一个条目指向他人仓库，建议删除或改标为灵感来源。
4. 补充 20 张漫画图的真实作品名与作者，更新 `content/media-credits.json` 的 `author`/`sourceUrl`/`attribution`。
5. 人工确认 Giscus GitHub App 已安装到本仓库（浏览器打开文章页，若出现 "giscus is not installed on this repository" 则未安装）。
6. 可选：绑定独立域名并配置 DNS（同时改三处域名常量，见 `README.md`）。

**已在本轮顺手处理**：工作流的 Node 20 弃用警告已消除——`actions/checkout@v5`、`actions/setup-node@v5`、`actions/upload-pages-artifact@v5`（内部 pin 到 `upload-artifact` v7）、`actions/deploy-pages@v5`，四者均运行在 node24 上；提交 `35f3f87`，run `34560717685` 成功且警告消失。

**已知但不在范围内的技术项**：git 历史中的旧大图；`.gitignore` 中失效的 `content/assets-inbox/` 规则；JSON-LD。

## 12. 接续规则

开始任何新任务前：

1. 进入 `C:\Users\typ\Desktop\New for codex\qingxpuli.github.io`（当前会话工作区可能不是这里）。
2. 先运行 `git status --short --branch`，保留用户已有修改；**不要**使用 `git reset --hard` 或 `git checkout --`。
3. 先读本文件、`README.md` 与相关组件，再决定是否改代码。
4. 只修改与当前请求有关的文件；不复制参考站点资源。
5. 新增公开媒体必须登记 `content/media-credits.json` 并如实填写 `rights`；没有明确使用权的素材不得发布。
6. 修改后运行 `npm run typecheck && npm run lint && npm test && npm run verify:media`，构建用 `NEXT_TELEMETRY_DISABLED=1 npm run build`；改动涉及嵌入播放器时确认不引入自动播放。
7. 只有用户明确要求发布时才推送；发布前确认构建、媒体审计与工作区状态。

可直接交给后续对话的接续提示词：

```text
请继续维护 C:\Users\typ\Desktop\New for codex\qingxpuli.github.io。
先阅读 PROJECT_HANDOFF.md 和 README.md，检查 git status，不要覆盖用户已有修改。
线上站点是 https://qingxpuli.github.io/，本轮 P0+P1 加固已完成并部署。
保留现有页面结构、音乐（网易云官方外链播放器 + 本地 LRC 同步，不得自动播放）、照片墙灯箱、搜索、主题、点击反馈、互动挂件、Giscus、
每页元数据与 OG、构建期 sitemap/feed/robots、代码高亮与文章目录、媒体授权门禁与 WebP 素材流程。
若要推进内容替换（真实文章、项目、音频、域名），先读 PROJECT_HANDOFF.md 第 11 节的 P2 清单。
不要复制 heiehiehi.github.io、xmyl-153.github.io/xingmengyouling-blog 或 Limbus 项目的源码、资源、文案、字体或 Live2D。
```
