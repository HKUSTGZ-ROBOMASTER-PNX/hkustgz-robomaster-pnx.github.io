const trainingDocument = { title: "PNX 培训中心", syncedAt: "" };

type TrainingBlock = {
  id: string;
  type: "paragraph" | "heading" | "bullet" | "ordered" | "quote" | "code" | "divider";
  level?: number;
  text?: string;
};

const blocks: TrainingBlock[] = [];

function renderSingleBlock(block: TrainingBlock) {
  const text = block.text?.trim() ?? "";
  const anchor = `section-${block.id}`;
  if (block.type === "divider") return <hr key={block.id} className="my-8 border-white/10" />;
  if (block.type === "heading") {
    if ((block.level ?? 1) <= 1) return <h2 id={anchor} key={block.id} className="scroll-mt-8 pt-8 text-2xl font-bold text-white sm:text-3xl">{text}</h2>;
    return <h3 id={anchor} key={block.id} className="scroll-mt-8 pt-7 text-xl font-bold text-white sm:text-2xl">{text}</h3>;
  }
  if (block.type === "quote") return <blockquote key={block.id} className="border-l-2 border-pnx-blue/80 bg-pnx-blue/[0.05] px-5 py-3 leading-7 text-white/72">{text}</blockquote>;
  if (block.type === "code") return <pre key={block.id} className="overflow-x-auto rounded border border-white/10 bg-black/40 p-4 text-sm leading-6 text-pnx-blue"><code>{text}</code></pre>;
  return <p key={block.id} className="leading-8 text-white/72">{text}</p>;
}

function renderContent() {
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
    content.push(renderSingleBlock(block));
    index += 1;
  }
  return content;
}

export function FeishuDocument() {
  if (!blocks.length) {
    return <div className="rounded border border-dashed border-white/18 bg-white/[0.025] p-6 text-sm leading-7 text-white/60">尚未同步本地网页版本。配置飞书应用和具体文档链接后，运行 <code className="text-pnx-blue">npm run sync:feishu</code> 即可生成。</div>;
  }

  const headings = blocks.filter((block) => block.type === "heading" && block.text?.trim());
  return (
    <article className="mx-auto max-w-7xl">
      <div className="mb-8 border-b border-white/10 pb-8">
        <p className="eyebrow">同步网页版本</p>
        <h2 className="mt-3 text-3xl font-black sm:text-5xl">{trainingDocument.title}</h2>
        <p className="mt-3 text-xs text-white/42">最近同步：{trainingDocument.syncedAt ?? "未知"}</p>
      </div>
      <div className="grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="lg:sticky lg:top-8 lg:self-start">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-pnx-blue">目录</p>
          <nav className="mt-4 border-l border-white/12 pl-4">
            {headings.map((heading) => <a key={heading.id} href={`#section-${heading.id}`} className={`block py-1.5 text-sm leading-6 transition hover:text-pnx-blue ${heading.level && heading.level > 1 ? "pl-3 text-white/48" : "text-white/68"}`}>{heading.text}</a>)}
          </nav>
        </aside>
        <div className="min-w-0 space-y-5">{renderContent()}</div>
      </div>
    </article>
  );
}
