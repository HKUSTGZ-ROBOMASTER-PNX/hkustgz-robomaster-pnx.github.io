import { Cpu, Gauge, Microchip, Wrench } from "lucide-react";
import { images } from "@/data/media";
import { Reveal } from "./Reveal";

const icons = [Cpu, Gauge, Microchip, Wrench];

export function Technology() {
  return (
    <section className="py-24 sm:py-32">
      <div className="section-shell">
        <Reveal className="mb-12 max-w-3xl">
          <p className="eyebrow">技术方向</p>
          <h2 className="mt-4 text-3xl font-bold tracking-normal sm:text-5xl">
            四个方向，构成一套竞赛系统。
          </h2>
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {images.technology.map((tech, index) => {
            const Icon = icons[index];
            return (
              <Reveal key={tech.title} delay={index * 0.07}>
                <article className="group overflow-hidden border border-white/12 bg-white/[0.035]">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={tech.src.replace(/\.jpg$/i, ".webp")}
                      alt={tech.alt}
                      className="h-full w-full object-cover opacity-80 transition duration-700 group-hover:scale-105 group-hover:opacity-100"
                      style={{ objectPosition: tech.focus }}
                      loading="lazy"
                      decoding="async"
                      width="800"
                      height="600"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute left-4 top-4 rounded-full border border-white/18 bg-black/35 p-3 text-pnx-blue backdrop-blur">
                      <Icon size={21} />
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-xl font-bold">{tech.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-white/62">{tech.description}</p>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
