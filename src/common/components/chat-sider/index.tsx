import { Avatar, Button, message } from "antd";
import { FC } from "react";
import dayjs from "dayjs";
import { createStyles } from "antd-style";
import { Conversations } from "@ant-design/x";
import avatarJPG from "@/assets/images/avatar.jpg";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";

const useStyle = createStyles(({ token, css }: { token: any; css: any }) => {
  return {
    // sider 样式
    sider: css`
      background: ${token.colorBgLayout}80;
      width: 280px;
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
    siderFooter: css`
      border-top: 1px solid ${token.colorBorderSecondary};
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    `,
  };
});

/** 聊天会话管理组件的属性定义  */
interface ChatConversationMGProps {
  // 会话列表，从外部传进来
  conversations: any[];
  // 设置会话列表
  setConversations: (conversations: any[]) => void;
  // 当前选中的key
  curConversationKey: string;
  // 设置当前用户激活(选中)的会话key
  setCurConversation: (conversationKey: string) => void;
  // 切换会话时需要更新对应messages
  setMessages: (messages: any[]) => void;
  // 历史消息表（键值对）
  messageHistory: Record<string, any>;
  // 请求中断控制器
  abortController: AbortController | undefined;
}

/**
 * <p>消息聊天会话管理函数组件</p>
 * <author>appleyk</author>
 * <mail>yukun24@126.com</main>
 * <date>2025年6月19日16:49:32</date>
 */
const ChatConversationMG: FC<ChatConversationMGProps> = ({
  conversations,
  setConversations,
  curConversationKey,
  setCurConversation,
  setMessages,
  messageHistory,
  abortController,
}) => {
  const { styles } = useStyle();
  return (
    <div className={styles.sider}>
      {/* 🌟 Logo */}
      <div className={styles.logo}>
        <img
          src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*eco6RrQhxbMAAAAAAAAAAAAADgCCAQ/original"
          draggable={false}
          alt="logo"
          width={24}
          height={24}
        />
        <span>Ant Design X</span>
      </div>

      {/* 🌟 添加会话 */}
      <Button
        onClick={() => {
          const now = dayjs().valueOf().toString();
          setConversations([
            ...conversations,
            {
              key: now,
              label: `New Conversation ${conversations.length + 1}`,
              init: true, // 第一轮问答结束的时候自动提取前xxx作为话题的name
              group: "今日",
            },
          ]);
          setCurConversation(now);
          setMessages([]);
        }}
        type="link"
        className={styles.addBtn}
        icon={<PlusOutlined />}
      >
        新建会话
      </Button>

      {/* 🌟 会话管理 */}
      <Conversations
        items={conversations}
        className={styles.conversations}
        activeKey={curConversationKey}
        onActiveChange={async (val) => {
          abortController && abortController.abort();
          /**
           * The abort execution will trigger an asynchronous requestFallback, which may lead to timing issues.
           * future versions, the sessionId capability will be added to resolve this problem.
           */
          setTimeout(() => {
            setCurConversation(val);
            console.log('1111: ', messageHistory?.[val])
            setMessages(messageHistory?.[val] || []);
          }, 100);
        }}
        groupable
        styles={{ item: { padding: "0 8px" } }}
        menu={(conversation) => ({
          items: [
            {
              label: "Rename",
              key: "rename",
              icon: <EditOutlined />,
            },
            {
              label: "Delete",
              key: "delete",
              icon: <DeleteOutlined />,
              danger: true,
              onClick: () => {
                const newList = conversations.filter(
                  (item) => item.key !== conversation.key
                );
                const newKey = newList?.[0]?.key;
                setConversations(newList);
                // The delete operation modifies curConversation.current and triggers onActiveChange, so it needs to be executed with a delay to ensure it overrides correctly at the end.
                // This feature will be fixed in a future version.
                setTimeout(() => {
                  if (conversation.key === curConversationKey) {
                    setCurConversation(newKey);
                    setMessages(messageHistory?.[newKey] || []);
                  }
                }, 200);
              },
            },
          ],
        })}
      />

      <div className={styles.siderFooter}>
        <Avatar size={24} src={avatarJPG} />
        <Button type="text" icon={<QuestionCircleOutlined />} />
      </div>
    </div>
  );
};
export default ChatConversationMG;
