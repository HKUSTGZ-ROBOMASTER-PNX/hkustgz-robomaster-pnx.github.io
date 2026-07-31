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
      <section className="relative overflow-hidden pb-8 pt-7 sm:pb-10 sm:pt-9">
        <div className="grid-fade absolute inset-0 opacity-35" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_8%,rgba(54,183,255,0.16),transparent_26rem),radial-gradient(circle_at_82%_18%,rgba(255,49,88,0.1),transparent_24rem)]" />

        <div className="section-shell relative">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <a
              href="../"
              className="inline-flex items-center gap-2 text-sm text-white/58 transition hover:text-pnx-blue"
            >
              <ArrowLeft size={17} />
              返回首页
            </a>
            <a
              href={trainingConfig.feishuUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center gap-2 border border-pnx-blue bg-pnx-blue px-4 py-2 text-sm font-bold text-black transition hover:bg-transparent hover:text-pnx-blue"
            >
              打开飞书原文
              <ExternalLink size={17} />
            </a>
          </div>

          <div className="mt-10 max-w-5xl">
            <p className="eyebrow">Training</p>
            <h1 className="mt-4 text-4xl font-black tracking-normal sm:text-5xl lg:text-6xl">
              {trainingConfig.title}
            </h1>
            <p className="mt-4 text-lg text-white/78 sm:text-xl">{trainingConfig.subtitle}</p>
            <p className="mt-4 max-w-4xl text-sm leading-7 text-white/62 sm:text-base">
              {trainingConfig.description}
            </p>
          </div>
        </div>
      </section>

      <section id="training-embed" className="pb-16 sm:pb-24">
        <div className="mx-auto w-[min(1500px,calc(100%-24px))]">
          <div className="overflow-hidden border border-white/12 bg-black shadow-glow">
            <div className="flex items-center justify-between gap-4 border-b border-white/10 bg-white/[0.035] px-5 py-4">
              <div>
                <p className="text-sm font-bold text-white">飞书 Wiki 内嵌预览</p>
                <p className="mt-1 text-xs text-white/48">默认请求深色显示；若出现登录页或空白，请打开飞书原文。</p>
              </div>
              <BookOpen className="shrink-0 text-pnx-blue" size={21} />
            </div>
            <iframe
              src={trainingConfig.embedUrl}
              title="PNX 飞书培训文档"
              className="h-[82vh] min-h-[760px] w-full bg-[#0b0f16]"
              loading="eager"
              referrerPolicy="origin"
              allow="fullscreen; clipboard-read; clipboard-write"
              style={{ colorScheme: "dark" }}
            />
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-[1.1fr_1.9fr]">
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

            <div className="grid gap-4 md:grid-cols-3">
              {trainingConfig.modules.map((module) => (
                <div key={module.title} className="border border-white/10 bg-white/[0.03] p-5">
                  <h3 className="text-lg font-bold">{module.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/58">{module.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
