import { ArrowRight } from "lucide-react";
import { Reveal } from "./Reveal";

export function JoinUs() {
  return (
    <section className="relative py-28 sm:py-36">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <div className="section-shell">
        <Reveal className="mx-auto max-w-4xl text-center">
          <p className="eyebrow">加入我们</p>
          <h2 className="mt-5 text-4xl font-black tracking-normal sm:text-6xl lg:text-7xl">
            加入 PNX Robotics
          </h2>
          <p className="mx-auto mt-7 max-w-2xl text-xl leading-9 text-white/74">
            造机器人。解复杂问题。把未来推上赛场。
          </p>
          <a
            href="mailto:pnx-robotics@example.com"
            className="mt-10 inline-flex min-h-12 items-center gap-3 border border-pnx-blue bg-pnx-blue px-6 py-3 text-sm font-bold uppercase tracking-[0.14em] text-black transition hover:bg-transparent hover:text-pnx-blue"
          >
            开始加入
            <ArrowRight size={18} />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
