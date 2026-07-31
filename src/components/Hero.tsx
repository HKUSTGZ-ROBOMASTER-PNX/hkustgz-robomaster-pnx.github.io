"use client";

import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { images } from "@/data/media";

export function Hero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <div className="image-vignette absolute inset-0">
        <img
          src={images.hero.src}
          alt={images.hero.alt}
          className="h-full w-full object-cover"
          style={{ objectPosition: images.hero.focus }}
        />
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,7,10,0.1),rgba(5,7,10,0.35)_42%,#05070a_100%)]" />
      <div className="grid-fade absolute inset-x-0 bottom-0 h-1/2 opacity-50" />

      <motion.div
        className="relative z-10 mx-auto flex w-[min(980px,calc(100%-32px))] flex-col items-center text-center"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="eyebrow mb-5">HKUST(GZ) RoboMaster Team</p>
        <h1 className="text-balance text-5xl font-black uppercase leading-none tracking-normal sm:text-7xl lg:text-8xl">
          PNX Robotics
        </h1>
        <p className="mt-6 text-lg font-medium text-white/82 sm:text-2xl">
          打造面向赛场的智能机器
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3 text-sm text-white/65">
          <span className="h-px w-10 bg-pnx-blue" />
          <span>为真实竞赛环境而生的机器人系统</span>
          <span className="h-px w-10 bg-pnx-red" />
        </div>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <a
            href="training"
            className="inline-flex min-h-12 items-center border border-pnx-blue bg-pnx-blue px-5 py-3 text-sm font-bold text-black transition hover:bg-transparent hover:text-pnx-blue"
          >
            培训资料
          </a>
          <a
            href="#about"
            className="inline-flex min-h-12 items-center border border-white/18 px-5 py-3 text-sm font-bold text-white/76 transition hover:border-white/40 hover:text-white"
          >
            了解战队
          </a>
        </div>
      </motion.div>

      <motion.a
        href="#about"
        aria-label="滚动到战队介绍"
        className="absolute bottom-7 left-1/2 z-10 -translate-x-1/2 rounded-full border border-white/20 p-3 text-white/70 backdrop-blur transition hover:border-pnx-blue hover:text-pnx-blue"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <ChevronDown size={22} />
      </motion.a>
    </section>
  );
}
