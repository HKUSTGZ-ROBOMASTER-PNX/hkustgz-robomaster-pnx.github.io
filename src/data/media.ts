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

export const combatRoles = [
  {
    title: "英雄｜苍穹之锤",
    type: "核心兵种",
    description: "发射 42mm 大弹丸，兼具远程吊射与近战速杀能力，对发射机构的精准度要求极高。"
  },
  {
    title: "工程｜动力引擎",
    type: "核心兵种",
    description: "通过机械臂结构与自定义控制器完成复杂存取、兑换任务，双臂与单臂方案各有挑战。"
  },
  {
    title: "无人机｜空中之王",
    type: "核心兵种",
    description: "稳定飞行与悬停，发射 17mm 弹丸支援地面单位，并从空中获得全场视野。"
  },
  {
    title: "步兵｜钢铁先锋",
    type: "传统兵种",
    description: "跨越复杂地形、穿梭战场，承担侦察、干扰与火力输出等多项任务。"
  },
  {
    title: "哨兵｜未来战士",
    type: "全自动兵种",
    description: "自主导航、自主决策并在战场上选择运动位置与打击目标，稳定性决定下限，决策能力决定上限。"
  },
  {
    title: "飞镖｜雷霆之击",
    type: "全自动兵种",
    description: "由云台手控制开启，执行超远程精确制导与爆炸打击。"
  },
  {
    title: "雷达｜全视之眼",
    type: "感知系统",
    description: "从制高点识别、定位并解析对手信息，为己方机器人提供易伤与决策支持。"
  },
  {
    title: "重装与蜂群无人机",
    type: "2026 新兵种",
    description: "重装完成三级装配并承担经济获取与大弹丸打击；蜂群由 4 架超小型无人机执行拦截、干扰与撞击任务。"
  }
] as const;

export const operators = [
  { title: "重装操作手 × 1", description: "完成既定任务，需要极致的冷静和专注。" },
  { title: "步兵操作手 × 2", description: "执行保护、干扰与击杀，依据场上局势作出即时战术决策。" },
  { title: "云台手 × 1", description: "控制无人机起降与飞镖发射，获取全局信息并指挥其他操作手。" }
] as const;

export const technologyDetails = [
  { title: "机械组", description: "从 SolidWorks 建模、参数优化到 3D 打印、CNC、车铣钳焊与激光切割，把结构设计制造成可上场的钢铁机器。" },
  { title: "硬件组", description: "负责原理图、PCB Layout、加工、焊接与测试，覆盖电机驱动、控制板、超级电容、无线充电与升降压模块。" },
  { title: "电控组", description: "以 STM32 和 C/C++ 为基础，连接硬件与算法，完成通信、传感器读取、运动控制、姿态解算、PID 与整车联调。" },
  { title: "算法组", description: "在高性能平台处理相机与激光雷达数据，开发自瞄、导航、雷达和飞镖制导，并落地 Linux、ROS2、OpenCV 与轻量神经网络。" },
  { title: "软件组", description: "完善队内软件生态，包括自定义客户端、模拟器与管理系统，让比赛信息和团队协作更加高效。" }
] as const;

export const recruitmentResources = [
  { title: "RoboMaster 赛事指南（第一期）", href: "https://www.bilibili.com/video/BV1xGwezFEUN/", source: "赛事入门" },
  { title: "RoboMaster 赛事指南（第二期）", href: "https://www.bilibili.com/video/BV18kdPBiEsy/", source: "赛事入门" },
  { title: "RoboMaster 赛事指南（第三期）", href: "https://www.bilibili.com/video/BV1ao3u6LE4W/", source: "赛事入门" },
  { title: "赛事指南与 2026 规则发布", href: "https://www.bilibili.com/video/BV1gjdGB4Eba", source: "哔哩哔哩" },
  { title: "一项机器人赛事，走出 20 万青年工程师", href: "https://www.peopleapp.com/column/30052888650-500007643026", source: "人民日报" },
  { title: "2026 全国总决赛图片直播", href: "https://www.xxpie.com/m/album?id=6a4e2a26a6f44227be62780c&source=SHARE_LINK&r=1766", source: "现场影像" },
  { title: "2026 赛季区域赛图片直播", href: "https://www.xxpie.com/m/album?id=69fca7f595e0d24fcfb46b9b&source=SHARE_LINK&r=2157", source: "现场影像" },
  { title: "哈工大竞培营", href: "https://space.bilibili.com/46946247/lists", source: "参考资料" },
  { title: "中科大电控", href: "https://space.bilibili.com/337732684/lists/1043942?type=season", source: "参考资料" }
] as const;
