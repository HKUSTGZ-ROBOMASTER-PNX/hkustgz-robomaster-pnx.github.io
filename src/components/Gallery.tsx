import { images } from "@/data/media";
import { Reveal } from "./Reveal";

export function Gallery() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(54,183,255,0.08),transparent_32%,rgba(255,49,88,0.08))]" />
      <div className="section-shell relative">
        <Reveal className="mb-12 max-w-3xl">
          <p className="eyebrow">比赛影像</p>
          <h2 className="mt-4 text-3xl font-bold tracking-normal sm:text-5xl">
            赛场，是工程能力被看见的地方。
          </h2>
        </Reveal>

        <div className="grid auto-rows-[220px] gap-4 md:grid-cols-4">
          {images.gallery.map((item, index) => (
            <Reveal
              key={item.title}
              delay={index * 0.06}
              className={index === 0 ? "md:col-span-2 md:row-span-2" : index === 3 ? "md:col-span-2" : ""}
            >
              <figure className="group relative h-full overflow-hidden border border-white/12 bg-white/[0.03]">
                <img
                  src={item.src}
                  alt={item.alt}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  style={{ objectPosition: item.focus }}
                />
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/88 to-transparent p-5">
                  <h3 className="text-lg font-bold">{item.title}</h3>
                  <p className="mt-1 text-sm text-white/62">{item.description}</p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
