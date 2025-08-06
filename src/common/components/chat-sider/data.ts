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

const siderCssStyle:any = createStyles(({ token, css }: { token: any; css: any }) => {
  return {
    // sider 样式
    sider: css`
      background: ${token.colorBgLayout}80;
      width: 360px;
      height: 100%;
      display: flex;
      flex-direction: column;
      padding: 0 12px;
      box-sizing: border-box;
    `,
    logo: css`
      display: flex;
      align-items: center;
      justify-content: start;
      padding: 0 24px;
      box-sizing: border-box;
      gap: 8px;
      margin: 24px 0;
      span {
        font-weight: bold;
        color: ${token.colorText};
        font-size: 16px;
      }
    `,
    addBtn: css`
      background: #1677ff0f;
      border: 1px solid #1677ff34;
      height: 40px;
      width: 100%;
    `,
    conversations: css`
      flex: 1;
      overflow-y: auto;
      margin-top: 12px;
      padding: 0;
      .ant-conversations-list {
        padding-inline-start: 0;
      }
    `,
    tabs: css`
      flex: 1;
      overflow-y: auto;
      margin-top: 2px;
      padding: 0;
      width: 280px;
    `,
    siderFooter: css`
      border-top: 1px solid ${token.colorBorderSecondary};
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    `,
  };
});

export {
    DEFAULT_CONVERSATIONS_ITEMS,
    siderCssStyle,
}