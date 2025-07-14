import { LLMNames } from "@/common/config/sysConfig";
import {
  CommentOutlined,
  HeartOutlined,
  PaperClipOutlined,
  SmileOutlined,
} from "@ant-design/icons";
import { AnyAsyncThunk } from "@reduxjs/toolkit/dist/matchers";
import { createStyles } from "antd-style";

/**
 * Chat List 样式
 * CssInJS
 */
const bubbleListCssStyle:any = createStyles(
  ({ token, css }: { token: any; css: any }) => {
    return {
      chatPrompt: css`
        .ant-prompts-label {
          color: #000000e0 !important;
        }
        .ant-prompts-desc {
          color: #000000a6 !important;
          width: 100%;
        }
        .ant-prompts-icon {
          color: #000000a6 !important;
        }
      `,
      chatList: css`
        flex: 1;
        overflow-y: auto;
      `,
      loadingMessage: css`
        background-image: linear-gradient(
          90deg,
          #ff6b23 0%,
          #af3cb8 31%,
          #53b6ff 89%
        );
        background-size: 100% 2px;
        background-repeat: no-repeat;
        background-position: bottom;
      `,
      placeholder: css`
        padding-top: 66px;
      `,
    };
  }
);

/** 热门主题 */
const HOT_TOPICS = {
  key: "1",
  label: "Hot Topics",
  children: [
    {
      key: "1-1",
      description: "帮我用Html写一个能运行的五子棋游戏。",
      icon: <span style={{ color: "#f93a4a", fontWeight: 700 }}>1</span>,
    },
    {
      key: "1-2",
      description: "OpenAI接入deepseek-r1官方api的例子？",
      icon: <span style={{ color: "#ff6565", fontWeight: 700 }}>2</span>,
    },
    {
      key: "1-3",
      description: "你对Ant Design X有了解吗?",
      icon: <span style={{ color: "#ff8f1f", fontWeight: 700 }}>3</span>,
    },
    {
      key: "1-4",
      description: "正向代理和反向代理的区别是什么？",
      icon: <span style={{ color: "green", fontWeight: 700 }}>4</span>,
    },
    {
      key: "1-5",
      description: "目前最流行的LLM有哪些?",
      icon: <span style={{ color: "blue", fontWeight: 700 }}>5</span>,
    },
    {
      key: "1-6",
      description: "苏州和北京今天天气如何?",
      icon: <span style={{ color: "red", fontWeight: 700 }}>6</span>,
    },
  ],
};

/** 设计指导（demo测试用的） */
const DESIGN_GUIDE = {
  key: "2",
  label: "Design Guide",
  children: [
    {
      key: "2-1",
      icon: <HeartOutlined />,
      label: "Intention",
      description: "AI understands user needs and provides solutions.",
    },
    {
      key: "2-2",
      icon: <SmileOutlined />,
      label: "Role",
      description: "AI's public persona and image",
    },
    {
      key: "2-3",
      icon: <CommentOutlined />,
      label: "Chat",
      description: "How AI Can Express Itself in a Way Users Understand",
    },
    {
      key: "2-4",
      icon: <PaperClipOutlined />,
      label: "Interface",
      description: 'AI balances "chat" & "do" behaviors.',
    },
  ],
};

/** llm配置 */
const llmOptions = [
  {
    value: LLMNames.ollama,
    label: "ollama:本地部署",
  },
  {
    value: LLMNames.deepseek,
    label: "深度求索：https://api.deepseek.com",
  },
];

export { bubbleListCssStyle, HOT_TOPICS, DESIGN_GUIDE, llmOptions };
