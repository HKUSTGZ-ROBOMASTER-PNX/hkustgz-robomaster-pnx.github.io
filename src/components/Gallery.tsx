"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Reveal } from "./Reveal";

type GalleryPhoto = {
  year: "2026" | "2025" | "2024";
  src: string;
  alt: string;
  title: string;
  description: string;
  focus?: string;
};

const photos: GalleryPhoto[] = [
  {
    year: "2026",
    src: "photos/1.jpg",
    alt: "RoboMaster 赛场中的 PNX 机器人与发光基地",
    title: "赛场系统",
    description: "在高压对抗中验证整机能力。"
  },
  {
    year: "2026",
    src: "photos/2.jpg",
    alt: "RoboMaster 机器人穿越赛场",
    title: "赛场瞬间",
    description: "机器人在快速变化的场地条件下穿越路线。"
  },
  {
    year: "2026",
    src: "photos/3.jpg",
    alt: "机器人在 RoboMaster 地形中行驶",
    title: "高速运动",
    description: "速度、稳定性与操作节奏共同作用。"
  },
  {
    year: "2026",
    src: "photos/4.jpg",
    alt: "多台机器人在赛场玻璃后对抗",
    title: "高压对抗",
    description: "赛场中的战术站位与临场决策。"
  },
  {
    year: "2026",
    src: "photos/5.jpg",
    alt: "RoboMaster 机器人在赛场坡道上运动的近景",
    title: "步兵平台",
    description: "机械结构、嵌入式控制与操作反馈在每一场对抗中持续迭代。"
  },
  {
    year: "2026",
    src: "photos/6.jpg",
    alt: "包含地面机器人与空中平台的 RoboMaster 赛场",
    title: "系统协同",
    description: "跨机型的场地感知与任务配合。"
  },
  {
    year: "2026",
    src: "photos/7.jpg",
    alt: "蓝色灯光下机器人在赛场结构旁移动",
    title: "赛场调试",
    description: "在实战环境中持续校准机器人状态与协作节奏。"
  },
  {
    year: "2026",
    src: "photos/8.jpg",
    alt: "舞台灯光下的 PNX 对抗机器人",
    title: "对抗机器人",
    description: "面向快速响应、稳定瞄准与长时间赛场运行打造的竞赛平台。"
  },
  {
    year: "2026",
    src: "photos/9.jpg",
    alt: "PNX Robotics 战队在 RoboMaster 赛事现场合影",
    title: "战队合影",
    description: "每一次出征，都由成员间的协作与投入共同完成。"
  },
  {
    year: "2026",
    src: "photos/10.jpg",
    alt: "红色灯光下俯拍的 PNX 机器人阵列",
    title: "机器人阵列",
    description: "底盘、云台、传感器与嵌入式系统协同调校。"
  }
];

const years = ["2026", "2025", "2024"] as const;

export function Gallery() {
  const [year, setYear] = useState<(typeof years)[number]>("2026");
  const [activeIndex, setActiveIndex] = useState(0);
  const yearPhotos = photos.filter((photo) => photo.year === year);
  const activePhoto = yearPhotos[activeIndex] ?? yearPhotos[0];
  const hasPhotos = yearPhotos.length > 0;

  const move = (direction: number) => {
    if (!hasPhotos) return;
    setActiveIndex((current) => (current + direction + yearPhotos.length) % yearPhotos.length);
  };

  const changeYear = (nextYear: (typeof years)[number]) => {
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
              {hasPhotos ? (
                <img
                  key={activePhoto.src}
                  src={activePhoto.src}
                  alt={activePhoto.alt}
                  className="aspect-[16/10] w-full animate-in object-cover duration-500 fade-in"
                  style={{ objectPosition: activePhoto.focus ?? "center" }}
                />
              ) : (
                <div className="flex aspect-[16/10] items-center justify-center bg-white/[0.03] text-sm text-white/45">
                  {year} 年影像整理中
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

          {hasPhotos && <div className="mt-6 flex justify-center gap-2" aria-label="照片进度">
            {yearPhotos.map((photo, index) => (
              <button
                key={photo.src}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`size-2 rounded-full transition ${
                  index === activeIndex ? "bg-pnx-blue ring-4 ring-pnx-blue/20" : "bg-white/25 hover:bg-white/60"
                }`}
                aria-label={`查看${photo.title}`}
                aria-current={index === activeIndex ? "true" : undefined}
              />
            ))}
          </div>}

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
