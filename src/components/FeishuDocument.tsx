import trainingDocument from "@/data/feishu-training.json";

type TrainingBlock = {
  id: string;
  type: "paragraph" | "heading" | "bullet" | "ordered" | "quote" | "code" | "divider";
  level?: number;
  text?: string;
};

function renderBlock(block: TrainingBlock) {
  const text = block.text ?? "";
  if (block.type === "divider") return <hr key={block.id} className="my-8 border-white/12" />;
  if (block.type === "heading") {
    const className = "mt-8 text-2xl font-bold text-white sm:text-3xl";
    if ((block.level ?? 1) <= 1) return <h2 key={block.id} className={className}>{text}</h2>;
    return <h3 key={block.id} className="mt-7 text-xl font-bold text-white sm:text-2xl">{text}</h3>;
  }
  if (block.type === "bullet") return <li key={block.id} className="leading-7 text-white/70">{text}</li>;
  if (block.type === "ordered") return <li key={block.id} className="leading-7 text-white/70">{text}</li>;
  if (block.type === "quote") return <blockquote key={block.id} className="border-l-2 border-pnx-blue pl-4 italic leading-7 text-white/65">{text}</blockquote>;
  if (block.type === "code") return <pre key={block.id} className="overflow-x-auto border border-white/12 bg-black/50 p-4 text-sm leading-6 text-pnx-blue"><code>{text}</code></pre>;
  return <p key={block.id} className="leading-7 text-white/70">{text}</p>;
}

export function FeishuDocument() {
  const blocks = trainingDocument.blocks as TrainingBlock[];
  if (!blocks.length) {
    return (
      <div className="border border-dashed border-white/18 bg-white/[0.025] p-6 text-sm leading-7 text-white/60">
        尚未同步本地网页版本。配置飞书应用和具体文档 ID 后，运行 <code className="text-pnx-blue">npm run sync:feishu</code> 即可生成。
      </div>
    );
  }

  return (
    <article className="border border-white/12 bg-white/[0.025] px-5 py-7 sm:px-10 sm:py-10">
      <div className="mb-8 border-b border-white/10 pb-5">
        <p className="eyebrow">同步网页版本</p>
        <h2 className="mt-3 text-3xl font-black sm:text-4xl">{trainingDocument.title}</h2>
        <p className="mt-3 text-xs text-white/45">最近同步：{trainingDocument.syncedAt ?? "未知"}</p>
      </div>
      <div className="space-y-4">
        {blocks.map((block) => renderBlock(block))}
      </div>
    </article>
  );
}
