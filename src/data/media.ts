export type SiteImage = {
  src: string;
  alt: string;
  title: string;
  description: string;
  focus?: string;
  href?: string;
  source?: string;
};

export const images = {
  hero: {
    src: "photos/1.jpg",
    alt: "RoboMaster 赛场中的 PNX 机器人与发光基地",
    title: "赛场系统",
    description: "在高压对抗中验证整机能力。",
    focus: "center"
  },
  about: {
    src: "photos/9.jpg",
    alt: "PNX Robotics 战队在 RoboMaster 赛事现场合影",
    title: "PNX 战队",
    description: "围绕机器人舰队协作的工程师、操作手与建设者。",
    focus: "center"
  },
  robots: [
    {
      src: "photos/8.jpg",
      alt: "舞台灯光下的 PNX 对抗机器人",
      title: "对抗机器人",
      description: "面向快速响应、稳定瞄准与长时间赛场运行打造的紧凑竞赛平台。",
      focus: "center"
    },
    {
      src: "photos/10.jpg",
      alt: "红色灯光下俯拍的 PNX 机器人阵列",
      title: "机器人阵列",
      description: "底盘、云台、传感器与嵌入式系统协同调校，形成完整作战单元。",
      focus: "center"
    },
    {
      src: "photos/5.jpg",
      alt: "RoboMaster 机器人在赛场坡道上运动的近景",
      title: "步兵平台",
      description: "机械结构、嵌入式控制与操作反馈在每一场对抗中持续迭代。",
      focus: "center"
    }
  ],
  gallery: [
    {
      src: "photos/2.jpg",
      alt: "RoboMaster 机器人穿越赛场",
      title: "赛场瞬间",
      description: "机器人在快速变化的场地条件下穿越路线。",
      focus: "center"
    },
    {
      src: "photos/3.jpg",
      alt: "机器人在 RoboMaster 地形中行驶",
      title: "高速运动",
      description: "速度、稳定性与操作节奏共同作用。",
      focus: "center"
    },
    {
      src: "photos/4.jpg",
      alt: "多台机器人在赛场玻璃后对抗",
      title: "高压对抗",
      description: "赛场中的战术站位与临场决策。",
      focus: "center"
    },
    {
      src: "photos/6.jpg",
      alt: "包含地面机器人与空中平台的 RoboMaster 赛场",
      title: "系统协同",
      description: "跨机型的场地感知与任务配合。",
      focus: "center"
    }
  ],
  technology: [
    {
      src: "photos/6.jpg",
      alt: "包含机器人与操作区的 RoboMaster 赛场",
      title: "人工智能",
      description: "围绕感知、识别与自主决策进行技术探索。",
      focus: "center"
    },
    {
      src: "photos/4.jpg",
      alt: "比赛中处于战术位置的机器人",
      title: "控制算法",
      description: "面向赛场动态调校运动控制与反馈回路。",
      focus: "center"
    },
    {
      src: "photos/7.jpg",
      alt: "蓝色灯光下机器人在赛场结构旁移动",
      title: "嵌入式",
      description: "构建可靠的固件、传感、通信与供电系统。",
      focus: "center"
    },
    {
      src: "photos/10.jpg",
      alt: "俯拍视角下的 PNX 机器人阵列",
      title: "机械结构",
      description: "追求强度、可维护性与赛场冲击力的结构设计。",
      focus: "center"
    }
  ],
  media: [
    {
      src: "photos/8.jpg",
      alt: "PNX 机器人技术文章封面",
      title: "步兵机器人英雄升级链路",
      description: "RoboMaster 社区中的 PnX 技术文章。",
      href: "https://bbs.robomaster.com/article/1401227?source=1",
      source: "RoboMaster 社区",
      focus: "center"
    },
    {
      src: "photos/10.jpg",
      alt: "PNX 机器人技术文章封面",
      title: "基于 ROS 的全向自瞄机器人",
      description: "RoboMaster 社区中的 PnX 技术文章。",
      href: "https://bbs.robomaster.com/article/1345989?source=1",
      source: "RoboMaster 社区",
      focus: "center"
    },
    {
      src: "photos/9.jpg",
      alt: "PNX Robotics 战队 B 站主页封面",
      title: "PNX 战队 B 站主页",
      description: "比赛视频、战队记录与后续公开视频入口。",
      href: "https://space.bilibili.com/3546679787653687",
      source: "哔哩哔哩",
      focus: "center"
    }
  ],
  placeholders: [
    "团队日常照片",
    "实验室开发照片",
    "视频封面素材",
    "公众号文章封面"
  ]
} satisfies Record<string, SiteImage | SiteImage[] | string[]>;

export const stats = [
  { label: "机器人", value: "10+" },
  { label: "成员", value: "40+" },
  { label: "赛季", value: "3+" }
];

export const robotTags = ["自主系统", "机械设计", "嵌入式控制"];
