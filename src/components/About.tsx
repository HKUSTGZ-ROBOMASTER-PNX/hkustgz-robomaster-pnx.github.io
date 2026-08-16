import { images, stats } from "@/data/media";
import { Reveal } from "./Reveal";

export function About() {
  return (
    <section id="about" className="relative py-24 sm:py-32">
      <div className="section-shell grid items-center gap-12 lg:grid-cols-[0.92fr_1.08fr]">
        <Reveal>
          <p className="eyebrow">关于 PNX</p>
          <h2 className="mt-4 max-w-xl text-3xl font-bold tracking-normal text-white sm:text-5xl">
            从工程调试台，走向 RoboMaster 赛场。
          </h2>
          <p className="mt-6 max-w-xl text-base leading-8 text-white/70">
            RoboMaster 是由大疆发起的机器人赛事，分为 RMUL 高校联盟赛、RMUC 超级对抗赛与 RMUA 人工智能挑战赛。PNX Robotics 汇聚机械、嵌入式、控制、视觉与运营方向的学生，在真实对抗压力下持续打造竞赛机器人。
          </p>
          <p className="mt-4 max-w-xl text-sm leading-7 text-white/55">
            穷究原理，洞悉本质；初心高于胜负，成长胜于输赢。这里不只验证机器，也培养面向真实工程问题的青年工程师。
          </p>
          <div className="mt-9 grid grid-cols-3 gap-3">
            {stats.map((stat) => (
              <div key={stat.label} className="glass-line px-4 py-5">
                <div className="text-3xl font-black text-white sm:text-4xl">{stat.value}</div>
                <div className="mt-2 text-xs font-semibold tracking-normal text-white/50">{stat.label}</div>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.12} className="relative">
          <div className="absolute -left-5 -top-5 h-28 w-28 border-l border-t border-pnx-blue/80" />
          <div className="absolute -bottom-5 -right-5 h-28 w-28 border-b border-r border-pnx-red/80" />
          <div className="relative overflow-hidden border border-white/12 bg-white/5">
            <img
              src={images.about.src.replace(/\.jpg$/i, ".webp")}
              alt={images.about.alt}
              className="aspect-[4/3] w-full object-cover"
              style={{ objectPosition: images.about.focus }}
              loading="lazy"
              decoding="async"
              width="1200"
              height="900"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
