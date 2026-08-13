import { images } from "@/data/media";
import { Reveal } from "./Reveal";

type MediaCardProps = {
  title: string;
  href: string;
  src: string;
  alt: string;
  focus?: string;
  wide?: boolean;
  delay?: number;
};

function MediaCard({ title, href, src, alt, focus, wide, delay = 0 }: MediaCardProps) {
  return (
    <Reveal className={wide ? "md:col-span-2" : undefined} delay={delay}>
      <article className={wide ? "mx-auto w-full max-w-2xl" : "h-full"}>
        <h3 className="mb-4 text-center text-base font-bold leading-7 text-white sm:text-lg">
          {title}
        </h3>
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          aria-label={`${title}（在新窗口打开）`}
          className="group block overflow-hidden border border-white/12 bg-black transition hover:border-pnx-blue/70 hover:shadow-glow"
        >
          <img
            src={src}
            alt={alt}
            className="aspect-video w-full object-cover transition duration-700 group-hover:scale-105"
            style={{ objectPosition: focus ?? "center" }}
            loading="lazy"
            decoding="async"
          />
        </a>
      </article>
    </Reveal>
  );
}

const videos = [
  {
    title: "2026PnX北部区域赛风采",
    href: "https://www.bilibili.com/video/BV18rMc6kEhY",
    src: "photos/bilibili-2026-north.jpg",
    alt: "2026 PnX 北部区域赛风采视频封面",
    wide: true
  },
  {
    title: "港科广PnX战队2026赛季纪念-【你横冲直撞，一直到最远方】",
    href: "https://www.bilibili.com/video/BV1rsEv6UEMk",
    src: "photos/bilibili-2026-season.jpg",
    alt: "港科广 PnX 战队 RoboMaster 2026 赛季纪念视频封面"
  },
  {
    title: "梦回救援工程",
    href: "https://www.bilibili.com/video/BV12hP1zYEUt",
    src: "photos/bilibili-rescue.jpg",
    alt: "梦回救援工程视频封面"
  }
] as const;

export function Media() {
  const articles = [
    {
      ...images.media[0],
      title: "【PNX论坛开源】HPM芯片开发经验与教程",
      src: "photos/forum-hpm-tutorial.png",
      alt: "PnX 战队 HPM 芯片开发经验与教程论坛文章封面",
      focus: "center top"
    },
    {
      ...images.media[1],
      title: "【PNX论坛开源】EtherCAT转CAN模块开源 软件+硬件",
      src: "photos/forum-ethercat-can.png",
      alt: "PnX 战队 EtherCAT 转 CAN 模块开源论坛文章封面",
      focus: "center top"
    }
  ];

  return (
    <section className="py-24 sm:py-32">
      <div className="section-shell">
        <Reveal className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="eyebrow">媒体内容</p>
            <h2 className="mt-4 text-3xl font-bold tracking-normal sm:text-5xl">PNX 文章与媒体</h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-white/60">
            收录 RoboMaster 社区技术文章与战队 B 站视频，点击封面即可查看原文或视频。
          </p>
        </Reveal>

        <div className="grid gap-x-4 gap-y-10 md:grid-cols-2">
          {articles.map((article, index) => (
            <MediaCard
              key={article.title}
              title={article.title}
              href={article.href ?? "#"}
              src={article.src}
              alt={article.alt}
              focus={article.focus}
              delay={index * 0.08}
            />
          ))}

          {videos.map((video, index) => (
            <MediaCard
              key={video.href}
              {...video}
              delay={(index + 2) * 0.08}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
