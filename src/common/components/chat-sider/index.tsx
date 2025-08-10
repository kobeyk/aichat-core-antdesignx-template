import { Avatar, Button, Tabs, Image, List, message } from "antd";
import { FC, useEffect, useState } from "react";
import dayjs from "dayjs";
import { Conversations } from "@ant-design/x";
import avatarJPG from "@/assets/images/avatar.jpg";
import siderLogo from "@/assets/images/sider-logo.png";
import siderSetting from "@/assets/images/sider-setting.jpg";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import type { TabsProps } from "antd";
import CustomIcon from "../custom-icon/index";
import { useAppSelector } from "@/store/hooks";
import { AssistantPrompt } from "@/services/slice/promptSlice";
import { siderCssStyle } from "./data";
import "./index.scss";

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
  /** antdStyle 样式组件（cssinjs） */
  const { styles } = siderCssStyle();
  /** 从store中取出助手提示词（后续可以基于Server API 去做） */
  const aiPrompts = useAppSelector((state) => state.aiPrompt.aiPrompts);
  const jumpMyCSDN = () => {
    window.open("https://blog.csdn.net/Appleyk/article/details/149234650");
  };
  const [selectedPropmtKey, setSelectedPropmtKey] = useState<number>();
  const onChange = (key: string) => {
    console.log(key);
  };
  const cacheSelectedPromptKey = (id:number) => {
    setSelectedPropmtKey(id);
    localStorage.setItem("promptId",id.toString());
  }

  useEffect(() => {
    let _selectedPropmtKey = localStorage.getItem("promptId")
    if (_selectedPropmtKey){
      setSelectedPropmtKey(Number(_selectedPropmtKey))
    }
  },[])

  const sidderItems: TabsProps["items"] = [
    {
      key: "1",
      label: "助手",
      icon: <CustomIcon type="icon-AIzhushou" style={{ fontSize: "16px" }} />,
      children: (
        <>
          {" "}
          <Button
            onClick={() => {message.success("别偷懒，赶紧实现这个功能吧！")}}
            type="link"
            className={styles.addBtn}
            icon={<PlusOutlined />}
          >
            添加助手
          </Button>
          <List
            itemLayout="horizontal"
            dataSource={aiPrompts}
            renderItem={(item: AssistantPrompt, index) => (
              <List.Item  onClick={()=>{cacheSelectedPromptKey(item.id)}}>
                <List.Item.Meta
                  key={item.id}
                  className={`ai-assistant-list-item-${item.id === selectedPropmtKey ? 'selected' : ''}`} 
                  avatar={
                    <Avatar
                      src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`}
                    />
                  }
                  title={item.name}
                  description={item.content}
                />
              </List.Item>
            )}
          />
        </>
      ),
    },
    {
      key: "2",
      label: "话题",
      icon: <CustomIcon type="icon-huati" style={{ fontSize: "16px" }} />,
      children: (
        <>
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
        </>
      ),
    },
    {
      key: "3",
      label: "设置",
      icon: <CustomIcon type="icon-shezhi" style={{ fontSize: "16px" }} />,
      children: <Image width={260} src={siderSetting} />,
    },
  ];

  return (
    <div className={styles.sider}>
      {/* 🌟 Logo */}
      <div className={styles.logo}>
        <img
          src={siderLogo}
          draggable={false}
          alt="logo"
          width={24}
          height={24}
        />
        <span
          style={{ cursor: "pointer", userSelect: "none" }}
          onClick={() =>
            window.open("https://www.npmjs.com/package/aichat-core", "_blank")
          }
        >
          AIChat-Core
        </span>
      </div>
      <Tabs
        className={styles.tabs}
        size="middle"
        defaultActiveKey="1"
        items={sidderItems}
        onChange={onChange}
      />
      <div className={styles.siderFooter} onClick={jumpMyCSDN}>
        <Avatar size={24} src={avatarJPG} />
        <p style={{ cursor: "pointer" }}>查看脚手架关联博文</p>
        <Button
          onClick={jumpMyCSDN}
          type="text"
          icon={<QuestionCircleOutlined />}
        />
      </div>
    </div>
  );
};
export default ChatConversationMG;
