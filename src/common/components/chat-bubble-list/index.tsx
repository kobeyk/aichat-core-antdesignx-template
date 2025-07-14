import { FC, useEffect, useRef, useState } from "react";
import {
  apiKey,
  baseUrl,
  defaultLLM,
  defaultModelName,
  LLMNames,
  ModelNames,
} from "@/common/config/sysConfig";
import {
  CopyOutlined,
  DislikeOutlined,
  LikeOutlined,
  ReloadOutlined,
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
import { throttle } from "lodash";
import aiJpg from "@/assets/images/ai.jpg";
import userJpg from "@/assets/images/avatar.jpg";
import { convertTimestampToDate } from "@/utils/utils";
import { ChatBubbleItem, LLMCallBackMessage, LLMClient } from "aichat-core";
import {
  DESIGN_GUIDE,
  HOT_TOPICS,
  llmOptions,
  bubbleListCssStyle,
} from "./data";
import "./index.scss";

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
  const { styles } = bubbleListCssStyle();
  const messagesEndRef = useRef<any>(null);
  const [currentModel, setCurrentModel] = useState<string>();

  useEffect(() => {
    if (defaultLLM === LLMNames.deepseek) {
      setCurrentModel(defaultModelName);
      onSetLLM({
        llmName: LLMNames.deepseek,
        apiKey: apiKey,
        baseUrl: baseUrl,
        modelName: defaultModelName,
      });
    } else {
      // 默认使用ollama（自定义部署llm方式）
      setCurrentModel(defaultModelName);
      onSetLLM({
        llmName: LLMNames.ollama,
        apiKey: "EMPTY",
        baseUrl: baseUrl,
        modelName: defaultModelName,
      });
    }
    console.log(
      `=====================0.默认使用的大语言模型：${defaultLLM},模型名称: ${defaultModelName}`
    );
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
    return (
      <Space direction="vertical">
        <p style={{ fontWeight: "bold" }}>{name}</p>
        <p style={{ fontSize: "0.8rem", color: "gray" }}>
          {convertTimestampToDate(msg.timed)}
        </p>
      </Space>
    );
  };

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
                icon:
                  callBackMessage.role === LLMClient.ROLE_USER ? (
                    <Avatar src={userJpg} />
                  ) : (
                    <Avatar src={aiJpg} />
                  ),
              },
              header: getBubbleItemHeader(callBackMessage),
              messageRender: () => (
                <ChatBubbleItem
                  llmMessage={callBackMessage}
                  className="chat-bubble-item"
                />
              ),
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
                  <Button
                    type="text"
                    size="small"
                    icon={<LikeOutlined />}
                    onClick={() => {
                      message.success("感谢老铁认可！");
                    }}
                  />
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
