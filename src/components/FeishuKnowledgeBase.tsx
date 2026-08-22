"use client";

import { Check, ChevronDown, ChevronRight, ChevronsLeft, ChevronsRight, Copy, FileText, Folder, List, Search } from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import trainingDocument from "@/data/feishu-training.json";

type TextLink = {
  start: number;
  end: number;
  url: string;
};

type TableCell = {
  id: string;
  text: string;
  links?: TextLink[];
  rowSpan?: number;
  colSpan?: number;
};

type TrainingBlock = {
  id: string;
  type: "paragraph" | "heading" | "bullet" | "ordered" | "quote" | "code" | "divider" | "image" | "table";
  level?: number;
  text?: string;
  src?: string;
  width?: number;
  height?: number;
  alt?: string;
  kind?: "board";
  language?: number;
  wrap?: boolean;
  links?: TextLink[];
  columns?: number;
  rows?: TableCell[][];
};

type KnowledgeDocument = {
  documentId: string;
  nodeToken?: string;
  title: string;
  depth?: number;
  sourceUrl: string;
  blocks: TrainingBlock[];
};

type KnowledgeNode = {
  nodeToken: string;
  parentNodeToken: string;
  title: string;
  depth?: number;
  objType?: string;
  documentId?: string;
  hasChild?: boolean;
};

const documents = (trainingDocument.documents ?? []) as KnowledgeDocument[];
const nodes = (trainingDocument.nodes ?? []) as KnowledgeNode[];

function normalizeLink(url: string) {
  let decoded = url;
  try {
    decoded = decodeURIComponent(url);
  } catch {
    // Keep the original URL when Feishu returns an invalid percent-encoding.
  }
  return /^(https?:\/\/|mailto:|tel:|\/|#)/i.test(decoded) ? decoded : null;
}

function getDocumentIdFromLink(url: string, documents: KnowledgeDocument[]) {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }
  const hostname = parsed.hostname.toLowerCase();
  const isFeishuHost = hostname === "feishu.cn" || hostname.endsWith(".feishu.cn") || hostname === "larksuite.com" || hostname.endsWith(".larksuite.com");
  if (!isFeishuHost) return null;
  const segments = parsed.pathname.split("/").filter(Boolean);
  const markerIndex = segments.findIndex((segment) => ["wiki", "docx", "document", "docs"].includes(segment.toLowerCase()));
  const token = markerIndex >= 0 ? segments[markerIndex + 1] : "";
  if (!token || token.toLowerCase() === "space") return null;
  let decodedToken = token;
  try {
    decodedToken = decodeURIComponent(token);
  } catch {
    // Keep the original token when Feishu returns an invalid percent-encoding.
  }
  return documents.find((document) => document.documentId === decodedToken || document.nodeToken === decodedToken)?.documentId ?? null;
}

function getWebLink(url: string, documents: KnowledgeDocument[]) {
  const documentId = getDocumentIdFromLink(url, documents);
  return documentId ? `?doc=${encodeURIComponent(documentId)}` : url;
}

function renderInlineText(text: string, links: TextLink[] | undefined, keyPrefix: string, documents: KnowledgeDocument[]): ReactNode {
  if (!links?.length) return text;
  const ranges = links
    .map((link, index) => ({ ...link, index, url: normalizeLink(link.url) }))
    .filter((link) => link.url && link.end > link.start && link.start < text.length)
    .sort((left, right) => left.start - right.start);
  if (!ranges.length) return text;

  const rendered: ReactNode[] = [];
  let cursor = 0;
  for (const link of ranges) {
    const start = Math.max(cursor, link.start);
    const end = Math.min(text.length, link.end);
    if (start > cursor) rendered.push(text.slice(cursor, start));
    if (end > start) {
      const webLink = getWebLink(link.url ?? "", documents);
      const isInternalLink = Boolean(link.url && webLink !== link.url);
      rendered.push(
        <a
          key={`${keyPrefix}-link-${link.index}`}
          href={webLink}
          {...(isInternalLink ? {} : { target: "_blank", rel: "noreferrer" })}
          className="text-pnx-blue underline decoration-pnx-blue/50 underline-offset-2 transition hover:text-white"
        >
          {text.slice(start, end)}
        </a>
      );
      cursor = end;
    }
  }
  if (cursor < text.length) rendered.push(text.slice(cursor));
  return rendered;
}

const codeLanguageLabels: Record<number, { label: string; key: string }> = {
  1: { label: "纯文本", key: "text" },
  7: { label: "Bash", key: "bash" },
  9: { label: "C++", key: "cpp" },
  10: { label: "C", key: "c" },
  12: { label: "CSS", key: "css" },
  18: { label: "Dockerfile", key: "dockerfile" },
  22: { label: "Go", key: "go" },
  24: { label: "HTML", key: "html" },
  28: { label: "JSON", key: "json" },
  29: { label: "Java", key: "java" },
  30: { label: "JavaScript", key: "javascript" },
  32: { label: "Kotlin", key: "kotlin" },
  13: { label: "CoffeeScript", key: "javascript" },
  39: { label: "Markdown", key: "markdown" },
  43: { label: "PHP", key: "php" },
  49: { label: "Python", key: "python" },
  53: { label: "Rust", key: "rust" },
  56: { label: "SQL", key: "sql" },
  61: { label: "Swift", key: "swift" },
  63: { label: "TypeScript", key: "typescript" },
  66: { label: "XML", key: "xml" },
  67: { label: "YAML", key: "yaml" },
  68: { label: "CMake", key: "cmake" },
  69: { label: "Diff", key: "diff" },
  75: { label: "TOML", key: "toml" },
  46: { label: "PowerShell", key: "bash" }
};

const codeKeywords = new Set([
  "as", "async", "await", "break", "case", "catch", "class", "const", "continue", "def", "delete", "do", "else", "enum", "export", "extends", "finally", "for", "from", "fn", "function", "if", "import", "in", "interface", "let", "match", "namespace", "new", "of", "package", "private", "protected", "public", "return", "select", "static", "struct", "switch", "template", "this", "throw", "try", "type", "typename", "using", "var", "void", "while", "with", "yield"
]);

function codeLanguage(language?: number) {
  return codeLanguageLabels[language ?? 1] ?? { label: "代码", key: "text" };
}

function highlightCode(source: string, language?: number): ReactNode {
  const languageInfo = codeLanguage(language);
  if (languageInfo.key === "text") return source;
  const tokenPattern = /(\/\*[\s\S]*?\*\/|\/\/[^\n]*|#[^\n]*|`(?:\\.|[^`])*`|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b\d+(?:\.\d+)?\b|\b[A-Za-z_$][\w$]*\b)/g;
  const nodes: ReactNode[] = [];
  let cursor = 0;
  let match;
  let key = 0;
  while ((match = tokenPattern.exec(source))) {
    const token = match[0];
    if (match.index > cursor) nodes.push(source.slice(cursor, match.index));
    const className = token.startsWith("//") || token.startsWith("/*") || token.startsWith("#")
      ? "text-white/40 italic"
      : token.startsWith('"') || token.startsWith("'") || token.startsWith("`")
        ? "text-emerald-300"
        : /^\d/.test(token)
          ? "text-amber-300"
          : codeKeywords.has(token)
            ? "text-pnx-blue"
            : /^(true|false|null|None|undefined|True|False)$/.test(token)
              ? "text-fuchsia-300"
              : "text-cyan-200";
    nodes.push(<span key={`code-token-${key++}`} className={className}>{token}</span>);
    cursor = match.index + token.length;
  }
  if (cursor < source.length) nodes.push(source.slice(cursor));
  return nodes;
}

async function copyCodeText(text: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
}

function CodeBlock({ block }: { block: TrainingBlock }) {
  const [copied, setCopied] = useState(false);
  const text = block.text ?? "";
  const languageInfo = codeLanguage(block.language);
  const handleCopy = async () => {
    try {
      await copyCodeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };
  return (
    <div className="my-6 overflow-hidden rounded border border-white/10 bg-black/40">
      <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white/48">
        <span>{languageInfo.label}</span>
        <button type="button" onClick={handleCopy} className="inline-flex items-center gap-1.5 text-white/55 transition hover:text-pnx-blue" aria-label="复制代码">
          {copied ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
          {copied ? "已复制" : "复制"}
        </button>
      </div>
      <pre className={`overflow-x-auto p-4 text-sm leading-6 text-white/80 ${block.wrap ? "whitespace-pre-wrap" : ""}`}><code>{highlightCode(text, block.language)}</code></pre>
    </div>
  );
}

function visibleBlocks(document: KnowledgeDocument) {
  return document.blocks.filter((block) => block.type === "divider" || block.type === "image" || block.type === "table" || Boolean(block.text?.trim()));
}

function DocumentBody({ document }: { document: KnowledgeDocument }) {
  const blocks = visibleBlocks(document);
  const headings = blocks.filter((block) => block.type === "heading" && block.text?.trim());
  const content = [];
  const [tocOpen, setTocOpen] = useState(true);
  const renderImage = (block: TrainingBlock, inGallery: boolean) => (
    <figure key={block.id} className={inGallery ? "min-w-0" : "my-8"}>
      <img
        src={block.src}
        alt={block.alt ?? "飞书文档图片"}
        width={block.width}
        height={block.height}
        loading="lazy"
        className={inGallery ? "h-auto max-h-[520px] w-full rounded border border-white/10 object-contain" : "h-auto max-h-[720px] w-auto max-w-full rounded border border-white/10 object-contain"}
      />
      {block.alt && block.alt !== "飞书文档图片" && <figcaption className="mt-2 text-sm text-white/45">{block.alt}</figcaption>}
    </figure>
  );
  let index = 0;
  while (index < blocks.length) {
    const block = blocks[index];
    if (block.type === "bullet" || block.type === "ordered") {
      const listType = block.type;
      const items = [];
      while (index < blocks.length && blocks[index].type === listType) {
        const item = blocks[index];
        items.push(
          <li key={item.id} className="leading-7 text-white/70">
            {renderInlineText(item.text ?? "", item.links, item.id, documents)}
          </li>
        );
        index += 1;
      }
      const List = listType === "bullet" ? "ul" : "ol";
      content.push(<List key={`list-${index}`} className={listType === "bullet" ? "list-disc space-y-2 pl-6" : "list-decimal space-y-2 pl-6"}>{items}</List>);
      continue;
    }
    if (block.type === "table") {
      const rows = block.rows ?? [];
      content.push(
        <div key={block.id} className="my-8 overflow-x-auto rounded border border-white/10">
          <table className="min-w-[640px] w-full border-collapse text-left text-sm">
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr key={`${block.id}-row-${rowIndex}`}>
                  {row.map((cell) => (
                    <td key={cell.id} rowSpan={cell.rowSpan} colSpan={cell.colSpan} className="whitespace-pre-wrap border border-white/10 px-3 py-2 align-top leading-6 text-white/72">
                      {renderInlineText(cell.text, cell.links, `${block.id}-${cell.id}`, documents)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      index += 1;
      continue;
    }
    if (block.type === "image" && block.src) {
      const images = [];
      while (index < blocks.length && blocks[index].type === "image" && blocks[index].src) {
        images.push(blocks[index]);
        index += 1;
      }
      if (images.length > 1) {
        content.push(<div key={`image-gallery-${images[0].id}`} className="my-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{images.map((image) => renderImage(image, true))}</div>);
      } else {
        content.push(renderImage(images[0], false));
      }
      continue;
    }
    const text = block.text ?? "";
    const renderedText = renderInlineText(text, block.links, block.id, documents);
    if (block.type === "divider") content.push(<hr key={block.id} className="my-8 border-white/10" />);
    else if (block.type === "heading" && (block.level ?? 1) <= 1) content.push(<h2 id={`section-${block.id}`} key={block.id} className="scroll-mt-8 pt-8 text-2xl font-bold text-white sm:text-3xl">{renderedText}</h2>);
    else if (block.type === "heading") content.push(<h3 id={`section-${block.id}`} key={block.id} className="scroll-mt-8 pt-7 text-xl font-bold text-white sm:text-2xl">{renderedText}</h3>);
    else if (block.type === "quote") content.push(<blockquote key={block.id} className="border-l-2 border-pnx-blue/80 bg-pnx-blue/[0.05] px-5 py-3 leading-7 text-white/72">{renderedText}</blockquote>);
    else if (block.type === "code") content.push(<CodeBlock key={block.id} block={block} />);
    else content.push(<p key={block.id} className="leading-8 text-white/72">{renderedText}</p>);
    index += 1;
  }

  return (
    <div className={`grid ${tocOpen ? "gap-10 lg:grid-cols-[180px_minmax(0,1fr)]" : "gap-0 lg:grid-cols-[0_minmax(0,1fr)]"}`}>
      <aside className={`lg:sticky lg:top-8 lg:self-start ${tocOpen ? "" : "w-0"}`}>
        {tocOpen ? <>
          <div className="mb-3 flex items-center justify-between border-b border-white/10 pb-3">
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-pnx-blue"><List size={15} aria-hidden="true" />本文目录</span>
            <button type="button" onClick={() => setTocOpen(false)} className="grid size-7 place-items-center text-white/45 transition hover:text-pnx-blue" aria-label="收起本文目录" title="收起本文目录">
              <ChevronsLeft size={18} aria-hidden="true" />
            </button>
          </div>
          <nav className="border-l border-white/12 pl-4">
            {headings.map((heading) => <a key={heading.id} href={`#section-${heading.id}`} className={`block py-1.5 text-sm leading-6 transition hover:text-pnx-blue ${heading.level && heading.level > 1 ? "pl-3 text-white/48" : "text-white/68"}`}>{heading.text}</a>)}
          </nav>
        </> : <button type="button" onClick={() => setTocOpen(true)} className="relative z-10 grid size-8 place-items-center text-white/55 transition hover:text-pnx-blue" aria-label="展开本文目录" title="展开本文目录">
          <ChevronsRight size={18} aria-hidden="true" />
        </button>}
      </aside>
      <div className="min-w-0 space-y-5">{content}</div>
    </div>
  );
}

export function FeishuKnowledgeBase() {
  const [query, setQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedId, setSelectedId] = useState(documents[0]?.documentId ?? "");
  useEffect(() => {
    const syncSelectedDocument = () => {
      const requestedId = new URLSearchParams(window.location.search).get("doc");
      setSelectedId(requestedId && documents.some((document) => document.documentId === requestedId) ? requestedId : documents[0]?.documentId ?? "");
    };
    syncSelectedDocument();
    window.addEventListener("popstate", syncSelectedDocument);
    return () => window.removeEventListener("popstate", syncSelectedDocument);
  }, []);
  const selectDocument = (documentId: string) => {
    setSelectedId(documentId);
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    url.searchParams.set("doc", documentId);
    window.history.pushState({}, "", `${url.pathname}?${url.searchParams.toString()}${url.hash}`);
  };
  const [expanded, setExpanded] = useState<Set<string>>(
    () => new Set(nodes.filter((node) => (node.depth ?? 0) < 2).map((node) => node.nodeToken))
  );
  const selected = documents.find((document) => document.documentId === selectedId) ?? documents[0];
  const filteredDocuments = useMemo(() => documents.filter((document) => document.title.toLowerCase().includes(query.trim().toLowerCase())), [query]);
  const childrenByParent = useMemo(() => {
    const result = new Map<string, KnowledgeNode[]>();
    for (const node of nodes) {
      const siblings = result.get(node.parentNodeToken) ?? [];
      siblings.push(node);
      result.set(node.parentNodeToken, siblings);
    }
    return result;
  }, []);

  const toggleNode = (nodeToken: string) => {
    setExpanded((current) => {
      const next = new Set(current);
      if (next.has(nodeToken)) next.delete(nodeToken);
      else next.add(nodeToken);
      return next;
    });
  };

  const renderDocumentButton = (document: KnowledgeDocument, depth = 0) => (
    <button key={document.documentId} type="button" onClick={() => selectDocument(document.documentId)} className={`flex w-full items-start gap-2 border-l-2 py-2 pr-2 text-left text-sm leading-6 transition ${selected?.documentId === document.documentId ? "border-pnx-blue bg-pnx-blue/[0.09] text-white" : "border-transparent text-white/58 hover:border-white/25 hover:text-white"}`} style={{ paddingLeft: `${8 + Math.min(depth, 5) * 12}px` }}>
      <FileText size={15} className="mt-1 shrink-0 text-white/35" aria-hidden="true" />
      <span>{document.title}</span>
    </button>
  );

  const renderNode = (node: KnowledgeNode): ReactNode => {
    const children = childrenByParent.get(node.nodeToken) ?? [];
    const document = node.documentId ? documents.find((item) => item.documentId === node.documentId) : undefined;
    const isExpanded = expanded.has(node.nodeToken);
    return (
      <div key={node.nodeToken}>
        <div className="flex items-start">
          {children.length > 0 ? <button type="button" onClick={() => toggleNode(node.nodeToken)} className="mt-2 grid size-5 shrink-0 place-items-center text-white/45 hover:text-pnx-blue" aria-label={isExpanded ? `收起${node.title}` : `展开${node.title}`}>
            {isExpanded ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
          </button> : <span className="w-5 shrink-0" />}
          {document ? renderDocumentButton(document, node.depth ?? 0) : <div className="flex min-w-0 items-start gap-2 py-2 text-sm font-semibold leading-6 text-white/70" style={{ paddingLeft: `${8 + Math.min(node.depth ?? 0, 5) * 12}px` }}><Folder size={15} className="mt-1 shrink-0 text-pnx-blue/70" aria-hidden="true" /><span>{node.title}</span></div>}
        </div>
        {children.length > 0 && isExpanded && <div>{children.map(renderNode)}</div>}
      </div>
    );
  };

  if (!documents.length) return <div className="rounded border border-dashed border-white/18 bg-white/[0.025] p-6 text-sm leading-7 text-white/60">尚未同步知识库内容。运行 <code className="text-pnx-blue">npm run sync:feishu</code> 即可同步整个知识库。</div>;

  return (
    <article className="w-full">
      <div className="mb-8 border-b border-white/10 pb-8">
        <p className="eyebrow">PNX Knowledge Base</p>
        <h2 className="mt-3 text-3xl font-black sm:text-5xl">PNX 培训知识库</h2>
        <p className="mt-3 text-sm text-white/48">{documents.length} 篇文档 · 最近同步 {trainingDocument.syncedAt ?? "未知"}</p>
      </div>
      <div className={`grid ${sidebarOpen ? "gap-8 lg:grid-cols-[280px_minmax(0,1fr)]" : "gap-0 lg:grid-cols-[0_minmax(0,1fr)]"}`}>
        <aside className={`lg:sticky lg:top-8 lg:max-h-[calc(100vh-64px)] lg:self-start ${sidebarOpen ? "" : "w-0"}`}>
          {sidebarOpen ? <>
            <div className="mb-3 flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-xs font-bold uppercase tracking-[0.16em] text-pnx-blue">文档目录</span>
              <button type="button" onClick={() => setSidebarOpen(false)} className="grid size-7 place-items-center text-white/45 transition hover:text-pnx-blue" aria-label="收起侧边栏" title="收起侧边栏">
                <ChevronsLeft size={18} aria-hidden="true" />
              </button>
            </div>
            <label className="flex items-center gap-2 border border-white/12 bg-white/[0.035] px-3 py-2 text-sm text-white/55">
              <Search size={16} aria-hidden="true" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索文档" className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-white/35" />
            </label>
            <nav className="mt-4 max-h-[calc(100vh-150px)] space-y-1 overflow-y-auto pr-2" aria-label="知识库文档列表">
              {query.trim() ? filteredDocuments.map((document) => renderDocumentButton(document)) : nodes.filter((node) => !node.parentNodeToken || !nodes.some((parent) => parent.nodeToken === node.parentNodeToken)).map(renderNode)}
            </nav>
          </> : <button type="button" onClick={() => setSidebarOpen(true)} className="relative z-10 grid size-8 place-items-center border border-white/12 text-white/55 transition hover:border-pnx-blue/60 hover:text-pnx-blue" aria-label="展开侧边栏" title="展开侧边栏">
            <ChevronsRight size={18} aria-hidden="true" />
          </button>}
        </aside>
        <section className="min-w-0">
          {selected && <>
            <div className="mb-8 border-b border-white/10 pb-6">
              <h3 className="text-3xl font-black sm:text-4xl">{selected.title}</h3>
              <a href={selected.sourceUrl} target="_blank" rel="noreferrer" className="mt-3 inline-block text-sm text-pnx-blue transition hover:text-white">在飞书中打开原文 ↗</a>
            </div>
            <DocumentBody document={selected} />
          </>}
        </section>
      </div>
    </article>
  );
}
