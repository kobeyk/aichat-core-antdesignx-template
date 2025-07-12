import { abortRequestMessage } from "@/common/config/sysConfig";
import {
  CloudUploadOutlined,
  FileSearchOutlined,
  PaperClipOutlined,
  ProductOutlined,
  ScheduleOutlined,
} from "@ant-design/icons";
import { Attachments, Prompts, Sender } from "@ant-design/x";
import { Button, Flex, GetProp, message } from "antd";
import { createStyles } from "antd-style";
import { FC, memo, useEffect, useState } from "react";
import CustomIcon from "../custom-icon";

/**
 * 消息发送组件CssInJS样式
 */
const useStyle = createStyles(({ token, css }: { token: any; css: any }) => {
  return {
    // sender 样式
    sender: css`
      width: 100%;
      max-width: 1100px;
      margin: 0 auto;
    `,
    speechButton: css`
      font-size: 18px;
      color: ${token.colorText} !important;
    `,
    senderPrompt: css`
      width: 100%;
      max-width: 1100px;
      margin: 0 auto;
      color: ${token.colorText};
    `,
  };
});

const SENDER_PROMPTS: GetProp<typeof Prompts, "items"> = [
  {
    key: "1",
    description: "目前最流行的LLM有哪些?",
    icon: <ScheduleOutlined />,
  },
  {
    key: "2",
    description: "你觉得LangChain这个框架如何?",
    icon: <ProductOutlined />,
  },
  {
    key: "3",
    description: "如何构建RAG？",
    icon: <FileSearchOutlined />,
  },
  {
    key: "4",
    description: "MCP与Function Calling的区别是？",
    icon: <FileSearchOutlined />,
  },
  {
    key: "5",
    description: "苏州今天天气如何？",
    icon: <FileSearchOutlined />,
  },
];

/**
 * 消息发送函数组件的属性定义
 */
interface ChatChatMessageSenderProps {
  loading: boolean;
  onMessageSend: (message: string) => void;
  // 请求中断控制器
  abortController: AbortController | undefined;
  // 清空消息
  clearMessageHistory: () => void;
}

/**
 * <p>消息发送函数组件(memo props 浅比较，如果没变，不会重新渲染)</p>
 * <author>appleyk</author>
 * <mail>yukun24@126.com</main>
 * <date>2025年6月19日16:35:55</date>
 */
const ChatMessageSender: FC<ChatChatMessageSenderProps> = memo(
  ({ loading, onMessageSend, abortController, clearMessageHistory }) => {
    const { styles } = useStyle();
    // 附件列表打开状态
    const [attachmentsOpen, setAttachmentsOpen] = useState(false);
    // 附件列表
    const [attachedFiles, setAttachedFiles] = useState<
      GetProp<typeof Attachments, "items">
    >([]);
    // 用户输入的内容（聊天内容）
    const [inputValue, setInputValue] = useState("");

    const senderHeader = (
      <Sender.Header
        title="Upload File"
        open={attachmentsOpen}
        onOpenChange={setAttachmentsOpen}
        styles={{ content: { padding: 0 } }}
      >
        <Attachments
          beforeUpload={() => false}
          items={attachedFiles}
          onChange={(info) => setAttachedFiles(info.fileList)}
          placeholder={(type) =>
            type === "drop"
              ? { title: "Drop file here" }
              : {
                icon: <CloudUploadOutlined />,
                title: "Upload files",
                description: "Click or drag files to this area to upload",
              }
          }
        />
      </Sender.Header>
    );

    useEffect(() => {
    }, []);
    return (
      <>
        {/* 🌟 提示词 */}
        <Prompts
          items={SENDER_PROMPTS}
          onItemClick={(info) => {
            onMessageSend(info.data.description as string);
          }}
          styles={{
            item: { padding: "6px 12px" },
          }}
          className={styles.senderPrompt}
        />
        {/* 🌟 输入框 */}
        <Sender
          value={inputValue}
          header={senderHeader}
          onSubmit={() => {
            onMessageSend(inputValue);
            setInputValue("");
          }}
          onChange={setInputValue}
          onCancel={() => {
            message.info(abortRequestMessage);
            abortController && abortController.abort();
          }}
          prefix={
            <Button
              type="text"
              icon={<PaperClipOutlined style={{ fontSize: 18 }} />}
              onClick={() => setAttachmentsOpen(!attachmentsOpen)}
            />
          }
          loading={loading}
          className={styles.sender}
          allowSpeech
          actions={(_, info) => {
            const { SendButton, LoadingButton, SpeechButton } = info.components;
            return (
              <Flex gap={4}>
                <CustomIcon
                  title="清空消息"
                  type="icon-qingchu"
                  style={{ fontSize: "20px" }}
                  onClick={() => {
                    clearMessageHistory();
                  }}
                />
                <SpeechButton className={styles.speechButton} />
                {loading ? (
                  <LoadingButton type="default" />
                ) : (
                  <SendButton type="primary" />
                )}
              </Flex>
            );
          }}
          placeholder="Ask or input / use skills"
        />
      </>
    );
  }
);
export default ChatMessageSender;
