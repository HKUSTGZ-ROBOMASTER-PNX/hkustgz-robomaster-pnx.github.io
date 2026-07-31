const feishuBaseUrl =
  "https://zanpw3z2hb6.feishu.cn/wiki/space/7666438057763015890?ccm_open_type=lark_wiki_spaceLink&open_tab_from=wiki_home";

export const trainingConfig = {
  feishuUrl: feishuBaseUrl,
  embedUrl: `${feishuBaseUrl}&theme=dark&dark=1&dark_mode=1`,
  title: "PNX 培训中心",
  subtitle: "面向新成员与项目组的训练资料入口",
  description:
    "这里汇总战队培训文档、学习路径与技术方向资料。页面会优先以大尺寸内嵌飞书 Wiki 展示；如果飞书要求登录或限制嵌入，请打开原文继续阅读。",
  modules: [
    {
      title: "入队基础",
      description: "战队协作方式、工程规范、赛季节奏与基础工具。"
    },
    {
      title: "机械与电控",
      description: "结构设计、加工装配、嵌入式开发与调试流程。"
    },
    {
      title: "视觉与算法",
      description: "感知、自瞄、控制与系统集成相关训练资料。"
    }
  ],
  fallbackTitle: "如果文档无法加载",
  fallbackDescription:
    "飞书公开链接可能仍会要求登录，或在部分浏览器中限制 iframe 展示。此时请直接打开飞书原文。深色显示会通过飞书链接参数优先请求；若飞书端忽略该参数，外层页面仍保持深色主题。"
};
