import type { Metadata } from "next";
import { ArrowLeft, ArrowUpRight, BookOpen, ExternalLink } from "lucide-react";
import { trainingConfig } from "@/data/training";

export const metadata: Metadata = {
  title: "PNX 培训中心 | PNX Robotics",
  description: "PNX Robotics 培训资料与飞书 Wiki 文档入口。"
};

export default function TrainingPage() {
  return (
    <main className="min-h-screen bg-pnx-ink text-white">
      <section className="relative overflow-hidden pb-16 pt-8 sm:pb-24 sm:pt-10">
        <div className="grid-fade absolute inset-0 opacity-40" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_8%,rgba(54,183,255,0.18),transparent_28rem),radial-gradient(circle_at_82%_18%,rgba(255,49,88,0.12),transparent_26rem)]" />

        <div className="section-shell relative">
          <a
            href="../"
            className="inline-flex items-center gap-2 text-sm text-white/58 transition hover:text-pnx-blue"
          >
            <ArrowLeft size={17} />
            返回首页
          </a>

          <div className="mt-16 max-w-4xl">
            <p className="eyebrow">Training</p>
            <h1 className="mt-5 text-4xl font-black tracking-normal sm:text-6xl lg:text-7xl">
              {trainingConfig.title}
            </h1>
            <p className="mt-5 text-xl text-white/78">{trainingConfig.subtitle}</p>
            <p className="mt-6 max-w-3xl text-base leading-8 text-white/62">
              {trainingConfig.description}
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a
                href={trainingConfig.feishuUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-12 items-center gap-3 border border-pnx-blue bg-pnx-blue px-5 py-3 text-sm font-bold text-black transition hover:bg-transparent hover:text-pnx-blue"
              >
                打开飞书培训文档
                <ExternalLink size={18} />
              </a>
              <a
                href="#training-embed"
                className="inline-flex min-h-12 items-center gap-3 border border-white/18 px-5 py-3 text-sm font-bold text-white/78 transition hover:border-white/40 hover:text-white"
              >
                查看内嵌文档
                <ArrowUpRight size={18} />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="training-embed" className="pb-20 sm:pb-28">
        <div className="section-shell">
          <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
            <div className="overflow-hidden border border-white/12 bg-white/[0.035]">
              <div className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-4">
                <div>
                  <p className="text-sm font-bold text-white">飞书 Wiki 预览</p>
                  <p className="mt-1 text-xs text-white/48">若出现登录页或空白，请打开飞书原文。</p>
                </div>
                <BookOpen className="shrink-0 text-pnx-blue" size={21} />
              </div>
              <iframe
                src={trainingConfig.feishuUrl}
                title="PNX 飞书培训文档"
                className="h-[72vh] min-h-[620px] w-full bg-white"
                loading="lazy"
                referrerPolicy="origin"
                allow="fullscreen; clipboard-read; clipboard-write"
              />
            </div>

            <aside className="space-y-4">
              <div className="glass-line p-5">
                <h2 className="text-xl font-bold">{trainingConfig.fallbackTitle}</h2>
                <p className="mt-3 text-sm leading-7 text-white/62">{trainingConfig.fallbackDescription}</p>
                <a
                  href={trainingConfig.feishuUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-pnx-blue transition hover:text-white"
                >
                  打开飞书原文
                  <ArrowUpRight size={16} />
                </a>
              </div>

              {trainingConfig.modules.map((module) => (
                <div key={module.title} className="border border-white/10 bg-white/[0.03] p-5">
                  <h3 className="text-lg font-bold">{module.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/58">{module.description}</p>
                </div>
              ))}
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
