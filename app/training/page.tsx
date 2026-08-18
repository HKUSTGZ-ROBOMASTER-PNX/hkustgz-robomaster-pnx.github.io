import type { Metadata } from "next";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { trainingConfig } from "@/data/training";
import { FeishuDocument } from "@/components/FeishuDocument";

export const metadata: Metadata = {
  title: "PNX 培训中心 | PNX Robotics",
  description: "PNX Robotics 培训资料与飞书 Wiki 文档入口。"
};

export default function TrainingPage() {
  return (
    <main className="min-h-screen bg-pnx-ink text-white">
      <section className="relative overflow-hidden pb-5 pt-7">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_8%,rgba(54,183,255,0.14),transparent_26rem),radial-gradient(circle_at_82%_18%,rgba(255,49,88,0.08),transparent_24rem)]" />
        <div className="section-shell relative">
          <div className="flex flex-wrap items-center justify-between gap-3">
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
              className="inline-flex items-center gap-2 text-sm font-bold text-pnx-blue transition hover:text-white"
            >
              打开飞书原文
              <ExternalLink size={16} />
            </a>
          </div>

          <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow">Training</p>
              <h1 className="mt-3 text-3xl font-black tracking-normal sm:text-5xl">
                {trainingConfig.title}
              </h1>
              <p className="mt-3 text-sm leading-6 text-white/62 sm:text-base">
                {trainingConfig.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="section-shell">
          <FeishuDocument />
        </div>
      </section>
    </main>
  );
}
