"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import trainingDocument from "@/data/feishu-training.json";

type TrainingBlock = {
  id: string;
  type: "paragraph" | "heading" | "bullet" | "ordered" | "quote" | "code" | "divider";
  level?: number;
  text?: string;
};

type KnowledgeDocument = {
  documentId: string;
  title: string;
  depth?: number;
  sourceUrl: string;
  blocks: TrainingBlock[];
};

const documents = (trainingDocument.documents ?? []) as KnowledgeDocument[];

function visibleBlocks(document: KnowledgeDocument) {
  return document.blocks.filter((block) => block.type === "divider" || Boolean(block.text?.trim()));
}

function DocumentBody({ document }: { document: KnowledgeDocument }) {
  const blocks = visibleBlocks(document);
  const headings = blocks.filter((block) => block.type === "heading" && block.text?.trim());
  const content = [];
  let index = 0;
  while (index < blocks.length) {
    const block = blocks[index];
    if (block.type === "bullet" || block.type === "ordered") {
      const listType = block.type;
      const items = [];
      while (index < blocks.length && blocks[index].type === listType) {
        items.push(<li key={blocks[index].id} className="leading-7 text-white/70">{blocks[index].text}</li>);
        index += 1;
      }
      const List = listType === "bullet" ? "ul" : "ol";
      content.push(<List key={`list-${index}`} className={listType === "bullet" ? "list-disc space-y-2 pl-6" : "list-decimal space-y-2 pl-6"}>{items}</List>);
      continue;
    }
    const text = block.text?.trim() ?? "";
    if (block.type === "divider") content.push(<hr key={block.id} className="my-8 border-white/10" />);
    else if (block.type === "heading" && (block.level ?? 1) <= 1) content.push(<h2 id={`section-${block.id}`} key={block.id} className="scroll-mt-8 pt-8 text-2xl font-bold text-white sm:text-3xl">{text}</h2>);
    else if (block.type === "heading") content.push(<h3 id={`section-${block.id}`} key={block.id} className="scroll-mt-8 pt-7 text-xl font-bold text-white sm:text-2xl">{text}</h3>);
    else if (block.type === "quote") content.push(<blockquote key={block.id} className="border-l-2 border-pnx-blue/80 bg-pnx-blue/[0.05] px-5 py-3 leading-7 text-white/72">{text}</blockquote>);
    else if (block.type === "code") content.push(<pre key={block.id} className="overflow-x-auto rounded border border-white/10 bg-black/40 p-4 text-sm leading-6 text-pnx-blue"><code>{text}</code></pre>);
    else content.push(<p key={block.id} className="leading-8 text-white/72">{text}</p>);
    index += 1;
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[180px_minmax(0,1fr)]">
      <aside className="lg:sticky lg:top-8 lg:self-start">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-pnx-blue">本文目录</p>
        <nav className="mt-4 border-l border-white/12 pl-4">
          {headings.map((heading) => <a key={heading.id} href={`#section-${heading.id}`} className={`block py-1.5 text-sm leading-6 transition hover:text-pnx-blue ${heading.level && heading.level > 1 ? "pl-3 text-white/48" : "text-white/68"}`}>{heading.text}</a>)}
        </nav>
      </aside>
      <div className="min-w-0 space-y-5">{content}</div>
    </div>
  );
}

export function FeishuKnowledgeBase() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(documents[0]?.documentId ?? "");
  const selected = documents.find((document) => document.documentId === selectedId) ?? documents[0];
  const filteredDocuments = useMemo(() => documents.filter((document) => document.title.toLowerCase().includes(query.trim().toLowerCase())), [query]);

  if (!documents.length) return <div className="rounded border border-dashed border-white/18 bg-white/[0.025] p-6 text-sm leading-7 text-white/60">尚未同步知识库内容。运行 <code className="text-pnx-blue">npm run sync:feishu</code> 即可同步整个知识库。</div>;

  return (
    <article className="mx-auto max-w-7xl">
      <div className="mb-8 border-b border-white/10 pb-8">
        <p className="eyebrow">PNX Knowledge Base</p>
        <h2 className="mt-3 text-3xl font-black sm:text-5xl">PNX 培训知识库</h2>
        <p className="mt-3 text-sm text-white/48">{documents.length} 篇文档 · 最近同步 {trainingDocument.syncedAt ?? "未知"}</p>
      </div>
      <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="lg:sticky lg:top-8 lg:max-h-[calc(100vh-64px)] lg:self-start">
          <label className="flex items-center gap-2 border border-white/12 bg-white/[0.035] px-3 py-2 text-sm text-white/55">
            <Search size={16} aria-hidden="true" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索文档" className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-white/35" />
          </label>
          <nav className="mt-4 max-h-[calc(100vh-150px)] space-y-1 overflow-y-auto pr-2" aria-label="知识库文档列表">
            {filteredDocuments.map((document) => <button key={document.documentId} type="button" onClick={() => setSelectedId(document.documentId)} className={`block w-full border-l-2 py-2 pr-2 text-left text-sm leading-6 transition ${selected?.documentId === document.documentId ? "border-pnx-blue bg-pnx-blue/[0.09] text-white" : "border-transparent text-white/58 hover:border-white/25 hover:text-white"}`} style={{ paddingLeft: `${12 + Math.min(document.depth ?? 0, 4) * 12}px` }}>{document.title}</button>)}
          </nav>
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
