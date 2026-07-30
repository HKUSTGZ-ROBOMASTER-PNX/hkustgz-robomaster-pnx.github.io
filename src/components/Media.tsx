import { ArrowUpRight, BicepsFlexed, Play } from "lucide-react";
import { images } from "@/data/media";
import { Reveal } from "./Reveal";

const icons = [BicepsFlexed, BicepsFlexed, Play];

export function Media() {
  return (
    <section className="py-24 sm:py-32">
      <div className="section-shell">
        <Reveal className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="eyebrow">媒体内容</p>
            <h2 className="mt-4 text-3xl font-bold tracking-normal sm:text-5xl">PNX 文章与媒体</h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-white/60">
            收录 RoboMaster 社区技术文章与战队 B 站入口，保留原文链接与真实素材封面。
          </p>
        </Reveal>

        <div className="grid gap-4 md:grid-cols-3">
          {images.media.map((item, index) => {
            const Icon = icons[index];
            return (
              <Reveal key={item.title} delay={index * 0.08}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group relative block h-full overflow-hidden border border-white/12 bg-white/[0.035] transition hover:border-pnx-blue/70 hover:shadow-glow"
                >
                  <img
                    src={item.src}
                    alt={item.alt}
                    className="aspect-[16/10] w-full object-cover transition duration-700 group-hover:scale-105"
                    style={{ objectPosition: item.focus }}
                  />
                  <div className="absolute left-5 top-5 rounded-full border border-white/20 bg-black/40 p-3 text-white backdrop-blur">
                    <Icon size={20} />
                  </div>
                  <div className="p-5">
                    <div className="mb-3 flex items-center justify-between gap-4 text-xs text-white/48">
                      <span>{item.source}</span>
                      <span className="inline-flex items-center gap-1 text-pnx-blue">
                        查看链接
                        <ArrowUpRight size={14} />
                      </span>
                    </div>
                    <h3 className="text-xl font-bold">{item.title}</h3>
                    <p className="mt-2 text-sm text-white/62">{item.description}</p>
                  </div>
                </a>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
