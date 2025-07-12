import { FC, useEffect, useRef, useState } from "react";
import {
  baseUrl,
  defaultLLM,
  LLMNames,
  ModelNames,
} from "@/common/config/sysConfig";
import {
  CommentOutlined,
  CopyOutlined,
  DislikeOutlined,
  HeartOutlined,
  LikeOutlined,
  PaperClipOutlined,
  ReloadOutlined,
  SmileOutlined,
  VerticalAlignBottomOutlined,
  VerticalAlignTopOutlined,
} from "@ant-design/icons";
import { Bubble, Prompts, Welcome } from "@ant-design/x";
import {
  Avatar,
  Button,
  Flex,
  FloatButton,
  message,
  Select,
  Space,
  Spin,
} from "antd";
import robotPng from "@/assets/images/robot.png";
import { createStyles } from "antd-style";
import { throttle } from "lodash";
import aiJpg from "@/assets/images/ai.jpg";
import userJpg from "@/assets/images/avatar.jpg";
import { convertTimestampToDate } from "@/utils/utils";
import { ChatBubbleItem, LLMCallBackMessage, LLMClient } from "aichat-core";
// import "github-markdown-css";
import "./index.scss";
/**
 * Chat List 样式
 * CssInJS
 */
const useStyle = createStyles(({ token, css }: { token: any; css: any }) => {
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
});

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

export interface LLMInfo {
  llmName: string;
  apiKey: string;
  baseUrl: string;
  modelName: string;
}

/**
 * 消息列表函数组件属性定义
 */
interface ChatBubbleListProps {
  /** 当前用户激活的会话Key */
  curConversation: string;
  /** 历史消息，一个对话对应一组历史消息 */
  messageHistory: Record<string, any>;
  /** LLM消息发送回调函数 */
  onMessageSend: (message: string) => void;
  /** 设置模型信息 */
  onSetLLM: (llmInfo: LLMInfo) => void;
}

/**
 * <p>消息聊天列表函数组件</p>
 * <author>appleyk</author>
 * <mail>yukun24@126.com</main>
 * <date>2025年6月19日16:45:55</date>
 */
const ChatBubbleList: FC<ChatBubbleListProps> = ({
  curConversation,
  messageHistory,
  onMessageSend,
  onSetLLM,
}) => {

  const { styles } = useStyle();
  const messagesEndRef = useRef<any>(null);
  const [currentModel, setCurrentModel] = useState<string>();

  useEffect(() => {
    if (defaultLLM === LLMNames.deepseek) {
      let defaultModelName = ModelNames.deepseek;
      setCurrentModel(defaultModelName);
      onSetLLM({
        llmName: LLMNames.deepseek,
        apiKey: import.meta.env.VITE_OPENAI_API_KEY,
        baseUrl: import.meta.env.VITE_OPENAI_BASE_URL,
        modelName: defaultModelName,
      });
      console.log("=====================0.默认大模型：" + defaultModelName);
    } else {
      // 默认使用ollama（自定义部署llm方式）
      let defaultModelName = ModelNames.ollama;
      setCurrentModel(defaultModelName);
      onSetLLM({
        llmName: LLMNames.ollama,
        apiKey: "EMPTY",
        baseUrl: baseUrl,
        modelName: defaultModelName,
      });
      console.log("=====================0.默认大模型：" + defaultModelName);
    }
  }, []);

  // 消息变了就自动滚动到底部
  useEffect(() => {
    scrollToBottom();
    return () => {
      scrollToBottom.cancel();
    };
  }, [messageHistory]);

  // 自动滚动到顶部
  const scrollToTop = () => {
    if (messagesEndRef.current) {
      console.log(messagesEndRef.current.scrollLeft);
      console.log(messagesEndRef.current.scrollTop);
      messagesEndRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // 自动滚动到底部(节流)
  const scrollToBottom = throttle((options: any = {}) => {
    if (messagesEndRef.current) {
      const height = messagesEndRef.current.scrollHeight;
      messagesEndRef.current.scrollTo({ top: height, ...options });
    }
  }, 300);

  const changeLLMInfo = (value: string) => {
    if (value === LLMNames.ollama) {
      onSetLLM({
        llmName: value,
        apiKey: "EMPTY",
        baseUrl: baseUrl,
        modelName: ModelNames.ollama,
      });
    } else if (value === LLMNames.deepseek) {
      onSetLLM({
        llmName: value,
        apiKey: import.meta.env.VITE_OPENAI_API_KEY,
        baseUrl: import.meta.env.VITE_OPENAI_BASE_URL,
        modelName: ModelNames.deepseek,
      });
    }
  };

  const selectLLM = (
    <div>
      <Select
        style={{ width: 420 }}
        placeholder="请选择一个合适的LLM模型进行聊天！"
        options={llmOptions}
        onChange={changeLLMInfo}
        defaultValue={LLMNames.deepseek}
      />
    </div>
  );

  const getBubbleItemHeader = (msg: LLMCallBackMessage) => {
    let name = msg.role === LLMClient.ROLE_USER ? "用户" : currentModel;
    return <Space direction="vertical">
      <p style={{ fontWeight: "bold" }}>{name}</p>
      <p style={{ fontSize: "0.8rem", color: "gray" }}>{convertTimestampToDate(msg.timed)}</p>
    </Space>
  }

  return (
    <div className={styles.chatList} ref={messagesEndRef}>
      {messageHistory[curConversation]?.length ? (
        /* 🌟 消息列表 */
        <Bubble.List
          items={messageHistory[curConversation]?.map(
            (callBackMessage: LLMCallBackMessage) => ({
              ...callBackMessage,
              classNames: {
                content: callBackMessage.loading ? styles.loadingMessage : "",
              },
              avatar: {
                icon: callBackMessage.role === LLMClient.ROLE_USER ? <Avatar src={userJpg} /> : <Avatar src={aiJpg} />,
              },
              header: getBubbleItemHeader(callBackMessage),
              messageRender: () => <ChatBubbleItem llmMessage={callBackMessage} className="chat-bubble-item"/>,
            })
          )}
          style={{
            paddingInline: "calc(calc(100% - 700px) /4)",
          }}
          roles={{
            assistant: {
              placement: "start",
              variant: "shadow",
              footer: (
                <div style={{ display: "flex" }}>
                  <Button type="text" size="small" icon={<ReloadOutlined />} />
                  <Button type="text" size="small" icon={<CopyOutlined />} />
                  <Button type="text" size="small" icon={<LikeOutlined />} onClick={() => { message.success("感谢老铁认可！") }} />
                  <Button type="text" size="small" icon={<DislikeOutlined />} />
                </div>
              ),
              loadingRender: () => <Spin size="small" />,
            },
            user: { placement: "start", variant: "shadow" },
          }}
        />
      ) : (
        <Space
          direction="vertical"
          size={16}
          style={{ width: "100%", alignItems: "center" }}
          className={styles.placeholder}
        >
          <Welcome
            variant="borderless"
            // icon="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*s5sNRo5LjfQAAAAAAAAAAAAADgCCAQ/fmt.webp"
            icon={<Avatar size={48} src={robotPng} />}
            // title={`Hello, I'm ${model}`}
            title={selectLLM}
            description="一个基于原生OpenAI和MCP·SDK结合编码实现的Web端全能AI助手！"
          />
          <Flex gap={16}>
            <Prompts
              items={[HOT_TOPICS]}
              styles={{
                list: { height: "100%" },
                item: {
                  flex: 1,
                  backgroundImage:
                    "linear-gradient(123deg, #e5f4ff 0%, #efe7ff 100%)",
                  borderRadius: 12,
                  border: "none",
                },
                subItem: { padding: 0, background: "transparent" },
              }}
              onItemClick={(info) => {
                onMessageSend && onMessageSend(info.data.description as string);
              }}
              className={styles.chatPrompt}
            />

            <Prompts
              items={[DESIGN_GUIDE]}
              styles={{
                item: {
                  flex: 1,
                  backgroundImage:
                    "linear-gradient(123deg, #e5f4ff 0%, #efe7ff 100%)",
                  borderRadius: 12,
                  border: "none",
                },
                subItem: { background: "#ffffffa6" },
              }}
              onItemClick={(info) => {
                onMessageSend && onMessageSend(info.data.description as string);
              }}
              className={styles.chatPrompt}
            />
          </Flex>
        </Space>
      )}
      {messageHistory[curConversation] &&
        messageHistory[curConversation].length > 0 && (
          <>
            <FloatButton
              tooltip={<div>回到顶部</div>}
              description=""
              className="float-button-top"
              onClick={scrollToTop}
              icon={<VerticalAlignTopOutlined />}
            />
            <FloatButton
              tooltip={<div>回到底部</div>}
              description=""
              className="float-button-bottom"
              onClick={scrollToBottom}
              icon={<VerticalAlignBottomOutlined />}
            />
          </>
        )}
    </div>
  );
};
export default ChatBubbleList;
