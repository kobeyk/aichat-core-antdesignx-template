import { createStyles } from "antd-style";
const DEFAULT_CONVERSATIONS_ITEMS = [
  {
    key: "default-0",
    label: "What is AIChat-Core?",
    init: false, // 是否初始化标题
    group: "今日",
  },
  {
    key: "default-1",
    label: "How to quickly install and use adxcli?",
    init: false, // 是否初始化标题
    group: "今日",
  },
  {
    key: "default-2",
    label: "A Library for OpenAI and MCP.",
    init: false, // 是否初始化标题
    group: "昨天",
  },
];

const chatCssStyle:any = createStyles(({ token, css }: { token: any; css: any }) => {
  return {
    layout: css`
      width: 100%;
      min-width: 1000px;
      height: 90vh;
      display: flex;
      background: ${token.colorBgContainer};
      font-family: AlibabaPuHuiTi, ${token.fontFamily}, sans-serif;
    `,
    // chat list 样式
    chat: css`
      height: 100%;
      width: 100%;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      padding-block: ${token.paddingLG}px;
      gap: 16px;
    `,
     assistant: css`
      display: flex;
      cursor: pointer;
      align-items: center;
      justify-content: center;
      width: 100%;
    `,
  };
});

export {
    DEFAULT_CONVERSATIONS_ITEMS,
    chatCssStyle,
}