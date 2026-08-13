"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Reveal } from "./Reveal";

type GalleryYear = "2026" | "2025" | "2024";

type GalleryPhoto = {
  year: GalleryYear;
  number: number;
  title: string;
  description: string;
};

const photos: GalleryPhoto[] = [
  ...Array.from({ length: 12 }, (_, index) => ({
    year: "2026" as const,
    number: index + 1,
    title: `2026 赛场记录 ${String(index + 1).padStart(2, "0")}`,
    description: "记录 PNX Robotics 在真实比赛环境中的协作、调试与对抗瞬间。"
  })),
  ...Array.from({ length: 16 }, (_, index) => ({
    year: "2025" as const,
    number: index + 1,
    title: `2025 赛场记录 ${String(index + 1).padStart(2, "0")}`,
    description: "记录 PNX Robotics 在真实比赛环境中的协作、调试与对抗瞬间。"
  }))
];

const years: GalleryYear[] = ["2026", "2025", "2024"];

export function Gallery() {
  const [year, setYear] = useState<GalleryYear>("2026");
  const [activeIndex, setActiveIndex] = useState(0);
  const yearPhotos = photos.filter((photo) => photo.year === year);
  const activePhoto = yearPhotos[activeIndex];
  const hasPhotos = yearPhotos.length > 0;

  const move = (direction: number) => {
    if (!hasPhotos) return;
    setActiveIndex((current) => (current + direction + yearPhotos.length) % yearPhotos.length);
  };

  const changeYear = (nextYear: GalleryYear) => {
    setYear(nextYear);
    setActiveIndex(0);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") move(-1);
      if (event.key === "ArrowRight") move(1);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  const imageSrc = activePhoto ? `photos/${activePhoto.year}/${activePhoto.number}.jpg` : undefined;

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

        <Reveal>
          <div className="mb-8 flex justify-center gap-2 sm:gap-4" aria-label="照片年份筛选">
            {years.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => changeYear(item)}
                className={`border px-5 py-2 text-sm font-bold transition sm:px-8 ${
                  year === item
                    ? "border-pnx-blue bg-pnx-blue text-pnx-ink"
                    : "border-white/15 bg-white/[0.03] text-white/60 hover:border-white/45 hover:text-white"
                }`}
                aria-pressed={year === item}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 sm:gap-6">
            <button
              type="button"
              onClick={() => move(-1)}
              disabled={!hasPhotos}
              className="grid size-11 shrink-0 place-items-center border border-white/20 bg-black/40 text-white transition hover:border-pnx-blue hover:text-pnx-blue sm:size-14"
              aria-label="上一张照片"
            >
              <ChevronLeft aria-hidden="true" />
            </button>

            <figure className="overflow-hidden border border-white/12 bg-black shadow-glow">
              {hasPhotos && activePhoto && imageSrc ? (
                <img
                  key={imageSrc}
                  src={imageSrc}
                  alt={activePhoto.title}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[16/10] w-full animate-in object-cover duration-500 fade-in"
                />
              ) : (
                <div className="flex aspect-[16/10] items-center justify-center bg-white/[0.03] text-sm text-white/45">
                  {year} 年照片整理中
                </div>
              )}
            </figure>

            <button
              type="button"
              onClick={() => move(1)}
              disabled={!hasPhotos}
              className="grid size-11 shrink-0 place-items-center border border-white/20 bg-black/40 text-white transition hover:border-pnx-blue hover:text-pnx-blue sm:size-14"
              aria-label="下一张照片"
            >
              <ChevronRight aria-hidden="true" />
            </button>
          </div>

          {hasPhotos && (
            <div className="mt-6 flex justify-center gap-2" aria-label="照片进度">
              {yearPhotos.map((photo, index) => (
                <button
                  key={photo.number}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={`size-2 rounded-full transition ${
                    index === activeIndex ? "bg-pnx-blue ring-4 ring-pnx-blue/20" : "bg-white/25 hover:bg-white/60"
                  }`}
                  aria-label={`查看${photo.title}`}
                  aria-current={index === activeIndex ? "true" : undefined}
                />
              ))}
            </div>
          )}

          <div className="mx-auto mt-8 max-w-3xl border-l-2 border-pnx-blue pl-5 text-center sm:pl-6">
            <p className="text-sm text-pnx-blue">照片介绍</p>
            <h3 className="mt-2 text-xl font-bold">{hasPhotos ? activePhoto.title : "敬请期待"}</h3>
            <p className="mt-2 text-sm leading-6 text-white/62">
              {hasPhotos ? activePhoto.description : "该年份的比赛影像将在后续补充。"}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
