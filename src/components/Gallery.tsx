"use client";

import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Reveal } from "./Reveal";

type GalleryYear = "2026" | "2025" | "2024";

type GalleryPhoto = {
  year: GalleryYear;
  number: number;
  title: string;
  description: string;
};

const photoNumbers: Record<Exclude<GalleryYear, "2024">, number[]> = {
  2026: Array.from({ length: 12 }, (_, index) => index + 1),
  2025: Array.from({ length: 16 }, (_, index) => index + 1)
};

const photos: GalleryPhoto[] = (Object.entries(photoNumbers) as [Exclude<GalleryYear, "2024">, number[]][]).flatMap(
  ([year, numbers]) =>
    numbers.map((number) => ({
      year,
      number,
      title: `${year} 赛场记录 ${String(number).padStart(2, "0")}`,
      description: "记录 PNX Robotics 在真实比赛环境中的协作、调试与对抗瞬间。"
    }))
);

const years: GalleryYear[] = ["2026", "2025", "2024"];
const AUTOPLAY_MS = 5000;

export function Gallery() {
  const [year, setYear] = useState<GalleryYear>("2026");
  const [activeIndex, setActiveIndex] = useState(0);
  const [isUserPaused, setIsUserPaused] = useState(false);
  const [isInteractionPaused, setIsInteractionPaused] = useState(false);
  const isPaused = isUserPaused || isInteractionPaused;
  const yearPhotos = useMemo(() => photos.filter((photo) => photo.year === year), [year]);
  const activePhoto = yearPhotos[activeIndex];
  const hasPhotos = yearPhotos.length > 0;
  const activeSrc = activePhoto ? `photos/${year}/${activePhoto.number}.jpg` : undefined;

  const move = (direction: number) => {
    if (!hasPhotos) return;
    setActiveIndex((current) => (current + direction + yearPhotos.length) % yearPhotos.length);
  };

  useEffect(() => {
    setActiveIndex(0);
  }, [year]);

  useEffect(() => {
    if (isPaused || !hasPhotos || yearPhotos.length < 2) return;
    const timer = window.setInterval(() => move(1), AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [activeIndex, hasPhotos, isPaused, yearPhotos.length]);

  useEffect(() => {
    if (!hasPhotos) return;
    [-1, 1].forEach((offset) => {
      const photo = yearPhotos[(activeIndex + offset + yearPhotos.length) % yearPhotos.length];
      if (photo) {
        const image = new window.Image();
        image.src = `photos/${year}/${photo.number}.jpg`;
      }
    });
  }, [activeIndex, hasPhotos, year, yearPhotos]);

  return (
    <section className="relative py-24 sm:py-32" aria-labelledby="gallery-title">
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(54,183,255,0.08),transparent_32%,rgba(255,49,88,0.08))]" />
      <div className="section-shell relative">
        <Reveal className="mb-12 max-w-3xl">
          <p className="eyebrow">比赛影像</p>
          <h2 id="gallery-title" className="mt-4 text-3xl font-bold tracking-normal sm:text-5xl">
            赛场，是工程能力被看见的地方。
          </h2>
        </Reveal>

        <Reveal>
          <div className="mb-8 flex flex-wrap items-center justify-center gap-2 sm:gap-4" aria-label="照片年份筛选">
            {years.map((item) => (
              <button key={item} type="button" onClick={() => setYear(item)} aria-pressed={year === item}
                className={`border px-5 py-2 text-sm font-bold transition sm:px-8 ${year === item ? "border-pnx-blue bg-pnx-blue text-pnx-ink" : "border-white/15 bg-white/[0.03] text-white/60 hover:border-white/45 hover:text-white"}`}>
                {item}
              </button>
            ))}
            <button type="button" onClick={() => setIsUserPaused((paused) => !paused)} aria-pressed={isUserPaused}
              className="inline-flex items-center gap-2 border border-white/15 bg-white/[0.03] px-4 py-2 text-sm text-white/70 transition hover:border-pnx-blue hover:text-pnx-blue">
              {isPaused ? <Play size={15} aria-hidden="true" /> : <Pause size={15} aria-hidden="true" />}
              {isUserPaused ? "继续轮播" : "暂停轮播"}
            </button>
          </div>

          <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 sm:gap-6"
            onMouseEnter={() => setIsInteractionPaused(true)} onMouseLeave={() => setIsInteractionPaused(false)}
            onFocus={() => setIsInteractionPaused(true)} onBlur={() => setIsInteractionPaused(false)}>
            <button type="button" onClick={() => move(-1)} disabled={!hasPhotos} className="grid size-11 shrink-0 place-items-center border border-white/20 bg-black/40 text-white transition hover:border-pnx-blue hover:text-pnx-blue disabled:opacity-30" aria-label="上一张照片"><ChevronLeft aria-hidden="true" /></button>
            <figure className="overflow-hidden border border-white/12 bg-black shadow-glow">
              {activePhoto && activeSrc ? <img key={activeSrc} src={activeSrc} alt={`${activePhoto.year} 年照片 ${activePhoto.number}`} loading="lazy" decoding="async" className="aspect-[16/10] w-full animate-in object-cover duration-500 fade-in" /> : <div className="flex aspect-[16/10] items-center justify-center bg-white/[0.03] text-sm text-white/45">{year} 年照片整理中</div>}
            </figure>
            <button type="button" onClick={() => move(1)} disabled={!hasPhotos} className="grid size-11 shrink-0 place-items-center border border-white/20 bg-black/40 text-white transition hover:border-pnx-blue hover:text-pnx-blue disabled:opacity-30" aria-label="下一张照片"><ChevronRight aria-hidden="true" /></button>
          </div>

          {hasPhotos && <div className="mt-6 flex justify-center gap-2" aria-label="照片进度">
            {yearPhotos.map((photo, index) => <button key={photo.number} type="button" onClick={() => setActiveIndex(index)} className={`size-2 rounded-full transition ${index === activeIndex ? "bg-pnx-blue ring-4 ring-pnx-blue/20" : "bg-white/25 hover:bg-white/60"}`} aria-label={`查看第 ${index + 1} 张照片`} aria-current={index === activeIndex ? "true" : undefined} />)}
          </div>}

          <div className="mx-auto mt-8 max-w-3xl border-l-2 border-pnx-blue pl-5 text-center sm:pl-6">
            <p className="text-sm text-pnx-blue">照片介绍</p>
            <h3 className="mt-2 text-xl font-bold">{activePhoto?.title ?? "敬请期待"}</h3>
            <p className="mt-2 text-sm leading-6 text-white/62">{activePhoto?.description ?? "该年份的比赛影像将在后续补充。"}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
