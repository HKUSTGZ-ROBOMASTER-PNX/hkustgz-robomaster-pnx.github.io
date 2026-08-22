import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import sharp from "sharp";

async function loadDotEnv() {
  try {
    const content = await readFile(resolve(".env"), "utf8");
    for (const line of content.split(/\r?\n/)) {
      const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
      if (!match || process.env[match[1]]) continue;
      process.env[match[1]] = match[2].replace(/^['"]|['"]$/g, "");
    }
  } catch {
    // .env is optional when variables are provided by the shell or CI.
  }
}

await loadDotEnv();

const appId = process.env.FEISHU_APP_ID;
const appSecret = process.env.FEISHU_APP_SECRET;
const configuredDocumentId = process.env.FEISHU_DOCUMENT_ID;
const wikiUrl = process.env.FEISHU_WIKI_URL || "https://zanpw3z2hb6.feishu.cn/wiki/space/7666438057763015890?ccm_open_type=lark_wiki_spaceLink&open_tab_from=wiki_home";
const outputPath = resolve("src/data/feishu-training.json");
const assetsDir = resolve("public/feishu-images");
const downloadedImages = new Map();
const downloadedBoards = new Map();
let assetDownloadQueue = Promise.resolve();

if (!appId || !appSecret) {
  console.error("缺少 FEISHU_APP_ID 或 FEISHU_APP_SECRET。请先参考 .env.example 配置环境变量。");
  process.exit(1);
}

async function requestJson(url, options = {}) {
  const response = await fetch(url, options);
  const body = await response.json();
  if (!response.ok || body.code) {
    throw new Error(`${response.status} ${body.msg ?? "飞书 API 请求失败"}`);
  }
  return body;
}

function authOptions(token) {
  return { headers: { Authorization: `Bearer ${token}` } };
}

function parseWikiUrl(url) {
  const parsed = new URL(url);
  const match = parsed.pathname.match(/\/wiki\/(space\/)?([^/]+)/);
  if (!match) throw new Error(`无法从 FEISHU_WIKI_URL 解析知识库链接：${url}`);
  return { isSpace: Boolean(match[1]), token: match[2] };
}

async function resolveWikiNode(token, accessToken) {
  const url = new URL("https://open.feishu.cn/open-apis/wiki/v2/spaces/get_node");
  url.searchParams.set("token", token);
  const response = await requestJson(url, authOptions(accessToken));
  return response.data?.node;
}

async function listWikiNodes(spaceId, accessToken, parentNodeToken = "", depth = 0) {
  const nodes = [];
  let pageToken = "";
  do {
    const url = new URL(`https://open.feishu.cn/open-apis/wiki/v2/spaces/${spaceId}/nodes`);
    url.searchParams.set("page_size", "50");
    if (pageToken) url.searchParams.set("page_token", pageToken);
    if (parentNodeToken) url.searchParams.set("parent_node_token", parentNodeToken);
    const page = await requestJson(url, authOptions(accessToken));
    nodes.push(...(page.data?.items ?? []));
    pageToken = page.data?.page_token ?? "";
  } while (pageToken);

  const nested = [];
  for (const node of nodes) {
    nested.push({ ...node, depth });
    if (node.has_child) nested.push(...await listWikiNodes(spaceId, accessToken, node.node_token, depth + 1));
  }
  return nested;
}

const blockPropertyNames = {
  2: "text",
  3: "heading1",
  4: "heading2",
  5: "heading3",
  6: "heading4",
  7: "heading5",
  8: "heading6",
  9: "heading7",
  10: "heading8",
  11: "heading9",
  12: "bullet",
  13: "ordered",
  14: "code",
  15: "quote"
};

function getContent(block) {
  const preferredName = blockPropertyNames[block.block_type];
  const value = block[preferredName] ?? Object.values(block).find((candidate) => candidate?.elements) ?? {};
  const elements = value.elements ?? [];
  return elements.map((element) => {
    if (element.text_run?.content) return element.text_run.content;
    if (element.mention_doc?.title) return element.mention_doc.title;
    if (element.mention_user?.user_id) return "";
    return "";
  }).join("");
}

async function findExistingAsset(token) {
  for (const extension of ["png", "jpg", "jpeg", "webp"]) {
    const fileName = `${token}.${extension}`;
    try {
      await access(resolve(assetsDir, fileName));
      return `/feishu-images/${fileName}`;
    } catch {
      // Try the next known image extension.
    }
  }
  return null;
}

function queueAssetDownload(task) {
  const queued = assetDownloadQueue
    .catch(() => {})
    .then(() => new Promise((resolveDelay) => setTimeout(resolveDelay, 350)))
    .then(task);
  assetDownloadQueue = queued.catch(() => {});
  return queued;
}

async function downloadImage(token, accessToken) {
  if (downloadedImages.has(token)) return downloadedImages.get(token);
  const existingPath = await findExistingAsset(token);
  if (existingPath) {
    downloadedImages.set(token, existingPath);
    return existingPath;
  }
  return queueAssetDownload(async () => {
    const cachedPath = await findExistingAsset(token);
    if (cachedPath) {
      downloadedImages.set(token, cachedPath);
      return cachedPath;
    }
    const response = await fetch(`https://open.feishu.cn/open-apis/drive/v1/medias/${token}/download`, authOptions(accessToken));
    if (!response.ok) throw new Error(`${response.status} 图片下载失败：${token}`);
    const contentType = response.headers.get("content-type") ?? "image/png";
    const extension = contentType.includes("jpeg") || contentType.includes("jpg") ? "jpg" : contentType.includes("webp") ? "webp" : "png";
    const fileName = `${token}.${extension}`;
    await writeFile(resolve(assetsDir, fileName), Buffer.from(await response.arrayBuffer()));
    const publicPath = `/feishu-images/${fileName}`;
    downloadedImages.set(token, publicPath);
    return publicPath;
  });
}

function getBoardToken(block) {
  const board = block.board ?? block.whiteboard ?? {};
  return board.token ?? board.whiteboard_id ?? block.token ?? "";
}

async function downloadBoardImage(token, accessToken) {
  if (downloadedBoards.has(token)) return downloadedBoards.get(token);

  const response = await fetch(
    `https://open.feishu.cn/open-apis/board/v1/whiteboards/${token}/download_as_image`,
    {
      ...authOptions(accessToken),
      headers: {
        ...authOptions(accessToken).headers,
        Accept: "image/png"
      }
    }
  );
  if (!response.ok) throw new Error(`${response.status} 画板图片下载失败：${token}`);

  const source = Buffer.from(await response.arrayBuffer());
  let output = source;
  try {
    // 飞书画板导出经常包含透明/纯色留白；sharp.trim() 等价于
    // ImageMagick 的 `mogrify -trim`，且不要求 CI 额外安装 ImageMagick。
    output = await sharp(source).trim().png().toBuffer();
  } catch (error) {
    console.warn(error instanceof Error ? `画板空白裁剪失败，保留原图：${error.message}` : `画板空白裁剪失败，保留原图：${token}`);
  }

  const fileName = `${token}-board.png`;
  await writeFile(resolve(assetsDir, fileName), output);
  const metadata = await sharp(output).metadata().catch(() => ({}));
  const result = {
    src: `/feishu-images/${fileName}`,
    width: metadata.width,
    height: metadata.height
  };
  downloadedBoards.set(token, result);
  return result;
}

async function convertBlock(block, accessToken) {
  const type = block.block_type;
  const names = {
    2: "paragraph",
    3: "heading",
    4: "heading",
    5: "heading",
    6: "heading",
    7: "heading",
    8: "heading",
    9: "heading",
    10: "heading",
    11: "heading",
    12: "bullet",
    13: "ordered",
    14: "code",
    15: "quote",
    27: "image",
    43: "board",
    22: "divider"
  };
  const convertedType = names[type];
  if (!convertedType) return null;
  if (convertedType === "image") {
    const image = block.image ?? {};
    try {
      return {
        id: block.block_id,
        type: "image",
        src: await downloadImage(image.token, accessToken),
        width: image.width,
        height: image.height,
        alt: image.caption?.content ?? "飞书文档图片"
      };
    } catch (error) {
      console.warn(error instanceof Error ? error.message : `图片下载失败：${image.token}`);
      return null;
    }
  }
  if (convertedType === "board") {
    const token = getBoardToken(block);
    if (!token) {
      console.warn(`画板块缺少 token，已跳过：${block.block_id}`);
      return null;
    }
    try {
      const board = await downloadBoardImage(token, accessToken);
      return {
        id: block.block_id,
        type: "image",
        kind: "board",
        src: board.src,
        width: board.width,
        height: board.height,
        alt: "飞书画板"
      };
    } catch (error) {
      console.warn(error instanceof Error ? error.message : `画板下载失败：${token}`);
      return null;
    }
  }
  return {
    id: block.block_id,
    type: convertedType,
    ...(convertedType === "heading" ? { level: Math.max(1, type - 2) } : {}),
    ...(convertedType !== "divider" ? { text: getContent(block) } : {})
  };
}

async function fetchDocument(documentId, accessToken) {
  const blocks = [];
  let pageToken = "";
  do {
    const url = new URL(`https://open.feishu.cn/open-apis/docx/v1/documents/${documentId}/blocks`);
    url.searchParams.set("page_size", "500");
    if (pageToken) url.searchParams.set("page_token", pageToken);
    const page = await requestJson(url, authOptions(accessToken));
    blocks.push(...(page.data?.items ?? []));
    pageToken = page.data?.page_token ?? "";
  } while (pageToken);

  const document = await requestJson(`https://open.feishu.cn/open-apis/docx/v1/documents/${documentId}`, authOptions(accessToken));
  return {
    title: document.data?.document?.title ?? "未命名文档",
    blocks: (await Promise.all(blocks.map((block) => convertBlock(block, accessToken)))).filter(Boolean)
  };
}

const tokenResponse = await requestJson("https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ app_id: appId, app_secret: appSecret })
});

const accessToken = tokenResponse.tenant_access_token;
await mkdir(assetsDir, { recursive: true });
const wiki = parseWikiUrl(wikiUrl);
let targets;
let wikiNodes = [];
if (configuredDocumentId && !configuredDocumentId.includes("需要填写")) {
  targets = [{ obj_token: configuredDocumentId, node_token: "", title: "PNX 培训中心", depth: 0 }];
} else if (!wiki.isSpace) {
  const node = await resolveWikiNode(wiki.token, accessToken);
  if (!node?.obj_token || node.obj_type !== "docx") {
    throw new Error(`知识库节点不是可读取的新版文档：${node?.title ?? wiki.token}`);
  }
  targets = [{ ...node, depth: 0 }];
} else {
  wikiNodes = await listWikiNodes(wiki.token, accessToken);
  targets = wikiNodes.filter((node) => node.obj_type === "docx");
}

if (!targets.length) throw new Error("知识库中没有找到可读取的新版文档。");

const syncedAt = new Date().toISOString();
const documents = [];
for (const target of targets) {
  console.log(`正在同步：${target.title ?? target.obj_token}`);
  const document = await fetchDocument(target.obj_token, accessToken);
  documents.push({
    nodeToken: target.node_token,
    parentNodeToken: target.parent_node_token ?? "",
    documentId: target.obj_token,
    title: document.title,
    depth: target.depth ?? 0,
    sourceUrl: target.node_token ? `https://zanpw3z2hb6.feishu.cn/wiki/${target.node_token}` : wikiUrl,
    blocks: document.blocks
  });
}

const nodes = wikiNodes.map((node) => ({
  nodeToken: node.node_token,
  parentNodeToken: node.parent_node_token ?? "",
  title: node.title ?? "未命名节点",
  depth: node.depth ?? 0,
  objType: node.obj_type,
  documentId: node.obj_type === "docx" ? node.obj_token : "",
  hasChild: Boolean(node.has_child)
}));
const output = { sourceUrl: wikiUrl, spaceId: wiki.isSpace ? wiki.token : "", syncedAt, nodes, documents };

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(output, null, 2)}\n`, "utf8");
console.log(`已同步 ${documents.length} 篇文档到 ${outputPath}`);
