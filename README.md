# hkustgz-robomaster-pnx.github.io

HKUST(GZ) RoboMaster PNX 机器人战队官网与培训知识库网站。

上游仓库：[HKUSTGZ-ROBOMASTER-PNX/hkustgz-robomaster-pnx.github.io](https://github.com/HKUSTGZ-ROBOMASTER-PNX/hkustgz-robomaster-pnx.github.io)

网站采用 Next.js 静态导出，部署到 GitHub Pages。首页用于展示战队介绍、技术方向、媒体内容和招新入口；培训页面将飞书知识库同步为可搜索、可展开收起目录的本地网页，并保留飞书原文链接。

## 功能概览

- 战队官网首页：Hero、战队介绍、技术方向、媒体图库和招新入口。
- 培训知识库：同步整个飞书 Wiki 空间，而不是只同步单篇文档。
- 知识库目录：支持目录树展开/收起、文档搜索和文档切换。
- 文档渲染：支持段落、标题、列表、引用、代码块、分隔线和图片。
- 图片本地化：同步时通过飞书素材接口下载图片，避免网页端直接请求可能失效的飞书图片地址。
- 静态部署：生成 `out/` 目录，由 GitHub Actions 自动发布到 GitHub Pages。

## 技术栈

- Next.js 14 App Router
- React 18
- TypeScript
- Tailwind CSS
- Lucide React 图标
- Framer Motion 动画
- Node.js 脚本与飞书开放平台 API
- GitHub Pages + GitHub Actions

## 目录结构

```text
.
├─ app/
│  ├─ page.tsx                  # 首页
│  ├─ training/page.tsx         # 培训知识库页面
│  ├─ layout.tsx                # 全局布局与元数据
│  └─ globals.css               # 全局样式与公共工具类
├─ src/
│  ├─ components/               # 首页、培训页和通用组件
│  └─ data/
│     ├─ training.ts            # 培训页基础配置
│     └─ feishu-training.json   # 飞书同步生成的知识库数据
├─ scripts/
│  └─ sync-feishu-doc.mjs       # 飞书 Wiki 同步脚本
├─ public/
│  └─ feishu-images/            # 同步下载的飞书图片资源
├─ photos/                      # 首页使用的图片素材
├─ .github/workflows/
│  └─ deploy-pages.yml          # GitHub Pages 自动部署
├─ .env.example                 # 环境变量模板
└─ out/                         # 静态构建输出，不提交到 Git
```

## 环境要求

- Node.js 20 或更高版本，CI 当前使用 Node.js 24
- npm
- 如需同步飞书知识库，需要一个已配置权限的飞书自建应用

## 安装与本地运行

```bash
npm ci
npm run dev
```

开发服务器默认地址为 <http://localhost:3000>。

生产构建和本地启动：

```bash
npm run build
npm run start
```

## 飞书知识库同步

### 1. 配置环境变量

复制 `.env.example` 为 `.env`，填写飞书应用凭证：

```dotenv
FEISHU_APP_ID=cli_xxxxxxxxxxxxx
FEISHU_APP_SECRET=xxxxxxxxxxxxxxxx
FEISHU_WIKI_URL=https://zanpw3z2hb6.feishu.cn/wiki/space/7666438057763015890
```

不要将真实的 `FEISHU_APP_SECRET` 提交到 Git。`.env` 已被 Git 忽略。

默认配置使用整个知识库空间。也可以指定单篇文档：

```dotenv
FEISHU_DOCUMENT_ID=具体文档的 obj_token
```

当 `FEISHU_DOCUMENT_ID` 有效时，脚本会优先同步该文档。

### 2. 执行同步

```bash
npm run sync:feishu
```

同步脚本会：

1. 使用 `FEISHU_APP_ID` 和 `FEISHU_APP_SECRET` 获取 tenant access token。
2. 遍历 `FEISHU_WIKI_URL` 对应空间下的 Wiki 节点。
3. 读取所有可访问的新版文档及其 Block 内容。
4. 将文档结构写入 `src/data/feishu-training.json`。
5. 将图片下载到 `public/feishu-images/`，并在 JSON 中保存本地 `/feishu-images/...` 路径。
6. 在培训页面展示同步后的目录和文档内容。

同步后重新启动开发服务器或重新执行构建即可查看最新内容。

### 飞书权限说明

同步结果取决于飞书应用对知识库和文档的访问权限。若某些文档或图片无法读取，脚本会在终端输出对应错误；无法下载的图片会被跳过，不会阻止其他文档完成同步。需要补充应用权限或将对应文档共享给该应用后，再次运行同步即可。

## 构建与部署

项目配置了静态导出：

```bash
npm run build
```

GitHub Pages 使用专用构建命令：

```bash
npm run build:pages
```

该命令生成 `out/` 静态文件。推送到 `main` 后，`.github/workflows/deploy-pages.yml` 会自动执行：

1. 安装依赖。
2. 执行 `npm run build:pages`。
3. 上传 `out/` 构建产物。
4. 发布到 GitHub Pages。

GitHub 仓库需要启用 Pages，并将发布方式设置为 **GitHub Actions**。飞书凭证不应放入前端代码或仓库；当前知识库同步是在本地完成后，将生成的数据和图片资源随站点一起发布。

## 常用命令

| 命令 | 用途 |
| --- | --- |
| `npm ci` | 按 lockfile 安装依赖 |
| `npm run dev` | 启动开发服务器 |
| `npm run build` | 执行生产构建检查 |
| `npm run build:pages` | 生成 GitHub Pages 静态站点 |
| `npm run start` | 启动生产模式服务 |
| `npm run sync:feishu` | 同步飞书 Wiki 文档和图片 |

## 内容维护建议

- 首页文案和模块数据优先修改 `src/data/` 及对应组件。
- 培训知识库内容以飞书 Wiki 为来源，不建议直接手工编辑 `src/data/feishu-training.json`。
- 修改飞书内容后，在本地重新运行 `npm run sync:feishu`，检查 `/training` 页面，再提交生成的数据和图片资源。
- 新增同步支持的 Block 类型时，同时修改同步脚本和 `src/components/FeishuKnowledgeBase.tsx` 的渲染逻辑。
- 提交前至少运行 `npm run build`，确认静态导出、类型检查和页面生成均正常。

## 常见问题

### 培训页没有最新文档

确认 `.env` 中的空间链接和应用凭证正确，然后重新运行：

```bash
npm run sync:feishu
npm run build
```

### 图片无法显示

确认同步后存在 `public/feishu-images/`，且 `src/data/feishu-training.json` 中图片 Block 的 `src` 使用 `/feishu-images/` 开头的本地路径。若同步日志显示 400 或权限错误，需要检查飞书应用对原图片所在文档的访问权限。

### GitHub Pages 页面资源 404

确认使用 `npm run build:pages` 构建，并检查仓库 Pages 是否由 GitHub Actions 发布。项目部署在自定义域名根路径，`next.config.mjs` 中的 `basePath` 和 `assetPrefix` 不应随意改为仓库名子路径。

### 本地可以访问飞书，线上不应直接依赖飞书登录态

培训页面使用同步后的本地 JSON 和本地图片资源，线上不需要浏览器访问飞书 API，也不需要暴露飞书应用密钥。

## 许可证与内容来源

网站代码归 HKUST(GZ) RoboMaster PNX 团队维护。培训文档内容及其图片来自团队飞书知识库，仅供团队内部培训和相关项目使用；发布或迁移内容时应遵守原文档的访问权限和使用范围。
