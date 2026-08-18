import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

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

async function listWikiNodes(spaceId, accessToken, parentNodeToken = "") {
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
    nested.push(node);
    if (node.has_child) nested.push(...await listWikiNodes(spaceId, accessToken, node.node_token));
  }
  return nested;
}

const blockPropertyNames = {
  1: "text",
  2: "heading1",
  3: "heading2",
  4: "heading3",
  5: "heading4",
  6: "heading5",
  7: "heading6",
  8: "heading7",
  9: "heading8",
  10: "bullet",
  11: "ordered",
  12: "code",
  13: "quote"
};

function getContent(block) {
  const value = block[blockPropertyNames[block.block_type]] ?? {};
  const elements = value.elements ?? [];
  return elements.map((element) => {
    if (element.text_run?.content) return element.text_run.content;
    if (element.mention_doc?.title) return element.mention_doc.title;
    if (element.mention_user?.user_id) return `@${element.mention_user.user_id}`;
    return "";
  }).join("");
}

function convertBlock(block) {
  const type = block.block_type;
  const names = {
    1: "paragraph",
    2: "heading",
    3: "heading",
    4: "heading",
    5: "heading",
    6: "heading",
    7: "heading",
    8: "heading",
    9: "heading",
    10: "bullet",
    11: "ordered",
    12: "code",
    13: "quote",
    22: "divider"
  };
  const convertedType = names[type];
  if (!convertedType) return null;
  return {
    id: block.block_id,
    type: convertedType,
    ...(convertedType === "heading" ? { level: Math.max(1, type - 1) } : {}),
    ...(convertedType !== "divider" ? { text: getContent(block) } : {})
  };
}

const tokenResponse = await requestJson("https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ app_id: appId, app_secret: appSecret })
});

const accessToken = tokenResponse.tenant_access_token;
const wiki = parseWikiUrl(wikiUrl);
let documentId = configuredDocumentId && !configuredDocumentId.includes("需要填写") ? configuredDocumentId : "";
let sourceUrl = wikiUrl;
let documentTitle = "PNX 培训中心";

if (!documentId) {
  if (!wiki.isSpace) {
    const node = await resolveWikiNode(wiki.token, accessToken);
    if (!node?.obj_token || !["docx", "doc"].includes(node.obj_type)) {
      throw new Error(`知识库节点不是可读取的新版文档：${node?.title ?? wiki.token}`);
    }
    documentId = node.obj_token;
    documentTitle = node.title ?? documentTitle;
  } else {
    const nodes = await listWikiNodes(wiki.token, accessToken);
    const documents = nodes.filter((node) => ["docx", "doc"].includes(node.obj_type));
    if (documents.length !== 1) {
      console.log(`知识库中发现 ${documents.length} 个文档，请将具体文档 URL 配置到 FEISHU_WIKI_URL 后再同步：`);
      for (const node of documents) {
        console.log(`- ${node.title} | https://zanpw3z2hb6.feishu.cn/wiki/${node.node_token}`);
      }
      process.exit(documents.length ? 2 : 1);
    }
    documentId = documents[0].obj_token;
    documentTitle = documents[0].title ?? documentTitle;
    sourceUrl = `https://zanpw3z2hb6.feishu.cn/wiki/${documents[0].node_token}`;
  }
}

const blocks = [];
let pageToken = "";
do {
  const url = new URL(`https://open.feishu.cn/open-apis/docx/v1/documents/${documentId}/blocks`);
  url.searchParams.set("page_size", "500");
  if (pageToken) url.searchParams.set("page_token", pageToken);
  const page = await requestJson(url, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  blocks.push(...(page.data?.items ?? []));
  pageToken = page.data?.page_token ?? "";
} while (pageToken);

const document = await requestJson(`https://open.feishu.cn/open-apis/docx/v1/documents/${documentId}`, {
  headers: { Authorization: `Bearer ${accessToken}` }
});

const output = {
  sourceUrl,
  documentId,
  title: document.data?.document?.title ?? documentTitle,
  syncedAt: new Date().toISOString(),
  blocks: blocks.map(convertBlock).filter(Boolean)
};

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(output, null, 2)}\n`, "utf8");
console.log(`已同步 ${output.blocks.length} 个网页块到 ${outputPath}`);
