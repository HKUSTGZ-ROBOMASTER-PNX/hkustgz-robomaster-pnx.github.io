export const trainingConfig = {
  feishuUrl:
    "https://zanpw3z2hb6.feishu.cn/wiki/space/7666438057763015890?ccm_open_type=lark_wiki_spaceLink&open_tab_from=wiki_home",
  title: "PNX 培训中心",
  subtitle: "面向新成员与项目组的训练资料入口",
  description:
    "这里汇总战队培训文档、学习路径与技术方向资料。页面优先尝试内嵌飞书 Wiki；如果飞书要求登录或禁止嵌入，请通过按钮打开原文。",
  modules: [
    {
      title: "入队基础",
      description: "了解战队协作方式、工程规范、赛季节奏与基础工具。"
    },
    {
      title: "机械与电控",
      description: "沉淀结构设计、加工装配、嵌入式开发与调试流程。"
    },
    {
      title: "视觉与算法",
      description: "整理感知、自瞄、控制与系统集成相关训练资料。"
    }
  ],
  fallbackTitle: "如果文档无法加载",
  fallbackDescription:
    "飞书公开链接可能仍会要求登录，或在部分浏览器中限制 iframe 展示。此时请直接打开飞书原文；后续也可以把核心培训目录同步为站内静态内容。"
};
