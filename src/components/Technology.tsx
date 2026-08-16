import { technologyDetails } from "@/data/media";
import { Reveal } from "./Reveal";

export function Technology() {
  return (
    <section className="py-24 sm:py-32">
      <div className="section-shell">
        <Reveal className="mb-12 max-w-3xl">
          <p className="eyebrow">技术方向</p>
          <h2 className="mt-4 text-3xl font-bold tracking-normal sm:text-5xl">
            五个组，构成一套竞赛系统。
          </h2>
        </Reveal>

        <Reveal>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-5">
            {technologyDetails.map((detail) => (
              <article key={detail.title} className="border border-white/10 bg-white/[0.025] p-5">
                <h3 className="text-lg font-bold">{detail.title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/58">{detail.description}</p>
              </article>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
