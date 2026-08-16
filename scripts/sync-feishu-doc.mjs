import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const appId = process.env.FEISHU_APP_ID;
const appSecret = process.env.FEISHU_APP_SECRET;
const documentId = process.env.FEISHU_DOCUMENT_ID;
const outputPath = resolve("src/data/feishu-training.json");
const sourceUrl = "https://zanpw3z2hb6.feishu.cn/wiki/space/7666438057763015890?ccm_open_type=lark_wiki_spaceLink&open_tab_from=wiki_home";

if (!appId || !appSecret || !documentId || documentId.includes("需要填写")) {
  console.error("缺少 FEISHU_APP_ID、FEISHU_APP_SECRET 或 FEISHU_DOCUMENT_ID。请先参考 .env.example 配置环境变量。");
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

const blocks = [];
let pageToken = "";
do {
  const url = new URL(`https://open.feishu.cn/open-apis/docx/v1/documents/${documentId}/blocks`);
  url.searchParams.set("page_size", "500");
  if (pageToken) url.searchParams.set("page_token", pageToken);
  const page = await requestJson(url, {
    headers: { Authorization: `Bearer ${tokenResponse.tenant_access_token}` }
  });
  blocks.push(...(page.data?.items ?? []));
  pageToken = page.data?.page_token ?? "";
} while (pageToken);

const document = await requestJson(`https://open.feishu.cn/open-apis/docx/v1/documents/${documentId}`, {
  headers: { Authorization: `Bearer ${tokenResponse.tenant_access_token}` }
});

const output = {
  sourceUrl,
  documentId,
  title: document.data?.document?.title ?? "PNX 培训中心",
  syncedAt: new Date().toISOString(),
  blocks: blocks.map(convertBlock).filter(Boolean)
};

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(output, null, 2)}\n`, "utf8");
console.log(`已同步 ${output.blocks.length} 个网页块到 ${outputPath}`);
