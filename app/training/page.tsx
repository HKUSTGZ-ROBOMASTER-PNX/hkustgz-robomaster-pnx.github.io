import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { FeishuKnowledgeBase } from "@/components/FeishuKnowledgeBase";

export const metadata: Metadata = {
  title: "PNX 培训中心 | PNX Robotics",
  description: "PNX Robotics 培训资料与飞书 Wiki 文档入口。"
};

export default function TrainingPage() {
  return (
    <main className="min-h-screen bg-pnx-ink text-white">
      <section className="relative overflow-hidden pb-5 pt-7">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_8%,rgba(54,183,255,0.14),transparent_26rem),radial-gradient(circle_at_82%_18%,rgba(255,49,88,0.08),transparent_24rem)]" />
        <div className="relative w-full px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <a
              href="../"
              className="inline-flex items-center gap-2 text-sm text-white/58 transition hover:text-pnx-blue"
            >
              <ArrowLeft size={17} />
              返回首页
            </a>

          </div>

        </div>
      </section>

      <section className="pb-20">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <FeishuKnowledgeBase />
        </div>
      </section>
    </main>
  );
}
