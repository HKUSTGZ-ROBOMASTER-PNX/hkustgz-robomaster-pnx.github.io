import { ArrowUpRight } from "lucide-react";
import { images, robotTags } from "@/data/media";
import { Reveal } from "./Reveal";

export function Robots() {
  return (
    <section className="py-24 sm:py-32">
      <div className="section-shell">
        <Reveal className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="eyebrow">机器人展示</p>
            <h2 className="mt-4 max-w-3xl text-3xl font-bold tracking-normal sm:text-5xl">
              在对抗、控制与迭代中成型的机器。
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {robotTags.map((tag) => (
              <span key={tag} className="border border-white/15 px-3 py-2 text-xs uppercase tracking-[0.14em] text-white/60">
                {tag}
              </span>
            ))}
          </div>
        </Reveal>

        <div className="grid gap-4 lg:grid-cols-3">
          {images.robots.map((robot, index) => (
            <Reveal key={robot.title} delay={index * 0.08} className={index === 0 ? "lg:col-span-2" : undefined}>
              <article className="group relative min-h-[420px] overflow-hidden border border-white/12 bg-white/[0.03]">
                <img
                  src={robot.src}
                  alt={robot.alt}
                  className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  style={{ objectPosition: robot.focus }}
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                  <div className="mb-3 flex items-center gap-2 text-pnx-blue">
                    <ArrowUpRight size={18} />
                    <span className="text-xs font-bold tracking-normal">PNX 竞赛平台</span>
                  </div>
                  <h3 className="text-2xl font-bold">{robot.title}</h3>
                  <p className="mt-3 max-w-xl text-sm leading-6 text-white/68">{robot.description}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
