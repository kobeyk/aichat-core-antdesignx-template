import React, { useEffect, useRef, useState } from "react";
import { logDebug, mcpServer, useMockData } from "@/common/config/sysConfig";
import { useXAgent, useXChat } from "@ant-design/x";
import { message as adxMessage, message, Select, Space } from "antd";
import ChatBubbleList from "../../common/components/chat-bubble-list";
import ChatMessageSender from "../../common/components/chat-sender/index";
import ChatConversationMG from "../../common/components/chat-sider";
import { ChatCompletionMessageParam } from "openai/resources/index";
import { LLMInfo } from "../../common/components/chat-bubble-list";
import { mockHistoryMessages } from "@/common/config/mock";
import { getTimeKey, processContent } from "@/utils/utils";
import {
  LLMCallBackMessage,
  LLMCallBackMessageChoice,
  LLMClient,
  McpTool,
} from "aichat-core";
import { chatCssStyle, DEFAULT_CONVERSATIONS_ITEMS } from "./data.js";
import { useAppSelector } from "@/store/hooks";
import SnConsts from '../../typing/extra/SnConsts';

type BubbleDataType = {
  role: string;
  content: string;
};

/**
 * <p>聊天容器函数组件</p>
 * <author>西柚配咖啡</author>
 * <mail>yukun24@126.com</main>
 * <date>2025年6月16日22:45:55</date>
 * <detail>https://space.bilibili.com/452968297?spm_id_from=333.1007.0.0</detail>
 */
const ChatBox: React.FC = () => {
  /** 从store中取出助手提示词（后续可以基于Server API 去做） */
  const aiPrompts = useAppSelector((state) => state.aiPrompt.aiPrompts);
  /** antdStyle 样式组件（cssinjs） */
  const { styles } = chatCssStyle();
  /** 请求中断控制器 */
  const abortController = useRef<AbortController>();
  /** 当前初始化的LLM大模型基本信息 */
  const [llmInfo, setLLMInfo] = useState<LLMInfo>();
  /** 助手角色（如：天气预报 | 研发经理 | 金融大佬） */
  const assistant = useRef<string>(undefined);
  // ==================== State ====================
  // 历史消息，一个对话对应一组历史消息
  const [messageHistory, setMessageHistory] = useState<Record<string, any>>(
    useMockData > 0 ? mockHistoryMessages : []
  );

  // 绑定一个llm client实例
  const llmClient = useRef<LLMClient>();
  // 选取工具
  const [toolCalls, setToolCalls] = useState<any[]>([]);
  // mcp服务器工具列表
  const [mcpTools, setMcpTools] = useState<McpTool[]>([]);
  // 函数调用结果(key对应的是函数名称，value对应的是函数执行的结果，结果是一个字符串，一般都是json，回显需要格式化)
  const [toolCallResult, setToolCallResult] = useState<Record<string, any>>({});
  // api服务状态，默认是true，假设用户配置的apiKey和baseUrl都是正确的，如果false则意味着后续无法进行LLM问答
  const apiState = useRef<boolean>(true);
  // 存储会话列表（默认default-0）
  const [conversations, setConversations] = useState(
    DEFAULT_CONVERSATIONS_ITEMS
  );

  // 当前聊天的结束状态
  const [loading, setLoading] = useState<boolean>(false);

  // 当前激活的会话 key，对应 conversations 中的某个会话
  const curConversation = useRef(DEFAULT_CONVERSATIONS_ITEMS[0].key);

  useEffect(() => {
    if (llmInfo) {
      // 实例化llmClient及初始化mcpClient
      const init = async () => {
        let _llmClient;
        let apiKey = llmInfo.apiKey;
        let baseUrl = llmInfo.baseUrl;
        let modelName = llmInfo.modelName;
        _llmClient = new LLMClient(mcpServer,"demo",apiKey,baseUrl,modelName);
        // 初始化mcp服务器
        await _llmClient.initMcpServer();
        // 设置mcp工具列表
        setMcpTools(_llmClient.listTools());
        // 是否开启流式日志debug模型，控制台打印每一步的chunk数据块对象
        _llmClient.setLogDebug(logDebug > 0)
        // 绑定client
        llmClient.current = _llmClient;
      };
      init();
    }
  }, [llmInfo]);

  useEffect(() => {
      let promptId = localStorage.getItem(SnConsts.PROMPT_CACHE_ID);
      if (promptId){
        assistant.current = aiPrompts[Number(promptId)-1].content;
      }else{
        assistant.current = aiPrompts[0].content;
      }
  },[])

  /** 消息回调 (callBackMessage对象已经经过深拷贝)*/
  const onMessageContentCallBack = (callBackMessage: LLMCallBackMessage) => {
    const _currentConversation = curConversation.current;
    let _llmChoices = callBackMessage.choices ?? [];
    let _messageId = callBackMessage.id;
    if (!_llmChoices || _llmChoices.length == 0) {
      return [];
    }
    setMessageHistory((sPrev) => ({
      ...sPrev,
      [_currentConversation]: sPrev[_currentConversation].map(
        (message: LLMCallBackMessage) => {
          if (_messageId != message.id) {
            return message;
          }
          let _message: LLMCallBackMessage = {
            id: _messageId,
            timed: callBackMessage.timed,
            model: callBackMessage.model,
            role: callBackMessage.role,
            typing: true,
            loading: false,
          };
          /** 拿到原来的 */
          let preMessageChoices = message.choices ?? [];
          _llmChoices.forEach((updateChoice: LLMCallBackMessageChoice) => {
            let _targets =
              preMessageChoices.filter(
                (preChoice: any) => updateChoice.index == preChoice.index
              ) ?? [];
            // 有值就动态修改值
            if (_targets.length > 0) {
              let _target = _targets[0];
              let _reason_content = _target.reasoning_content ?? "";
              let _content = _target.content ?? "";
              _target.thinking = updateChoice.thinking;
              if (
                updateChoice.reasoning_content &&
                updateChoice.reasoning_content != ""
              ) {
                _target.reasoning_content =
                  _reason_content + updateChoice.reasoning_content;
              }
              if (updateChoice.content && updateChoice.content != "") {
                _target.content = _content + updateChoice.content;
              }
              _target.toolsCallDes = updateChoice.toolsCallDes;
              _target.tools = updateChoice.tools;
              _target.usage = updateChoice.usage;
            } else {
              // 否则的话就添加一个
              preMessageChoices.push(updateChoice);
            }
          });
          // 最后别忘了给值(这个地方要用深拷贝)
          _message.choices = JSON.parse(JSON.stringify(preMessageChoices));
          return _message;
        }
      ),
    }));
  };

  /**
   * 工具调用信息回调函数
   */
  const onCallToolCallBack = (toolCalls: any[]) => {
    if (toolCalls && toolCalls.length > 0) {
      setToolCalls(toolCalls);
    }
  };

  /**
   * 工具调用结果回调函数
   * @param name 函数名称
   * @param result 函数调用结果（字符串）
   */
  const onCallToolResultCallBack = (name: string, result: any) => {
    let _toolCallResult = toolCallResult;
    _toolCallResult[name] = result;
    setToolCallResult(_toolCallResult);
  };

  /** 清空当前聊天会话中的消息列表 */
  const clearMessageHistory = () => {
    const _currentConversation = curConversation.current;
    if (messageHistory && _currentConversation) {
      messageHistory[_currentConversation];
      setMessageHistory((prev) => ({
        ...prev,
        [_currentConversation]: [],
      }));
    }
  };

  /** 设置当前激活的会话key */
  const setCurrentConversation = (key: string) => {
    curConversation.current = key;
  };

  /** 设置当前选择的LLM信息 */
  const onSetLLMInfo = (llmInfo: LLMInfo) => {
    setLLMInfo(llmInfo);
  };

  /** 初始化用户消息及AI消息 */
  const onInitMessage = (
    messageId: number,
    role: string,
    conversationKey: string,
    content: string,
    loading: boolean = false
  ) => {
    setMessageHistory((prev) => ({
      ...prev,
      [conversationKey]: [
        ...(prev[conversationKey] || []),
        {
          id: messageId,
          timed: Date.now(),
          role: role,
          typing: true,
          loading: loading,
          choices: [{ index: 1, content: content }],
        },
      ],
    }));
  };

  /** 初始化消息上下文（后续这个要从数据库查，system部分从维护的助手拿，然后整体上下文截取最近的前N条） */
  const onInitMessageContent = (
    userContent: string
  ): ChatCompletionMessageParam[] => {
    let promptId = localStorage.getItem(SnConsts.PROMPT_CACHE_ID);
    if (promptId){
      assistant.current = aiPrompts[Number(promptId)-1].content;
    }else{
      assistant.current = aiPrompts[0].content;
    }
    let messages: ChatCompletionMessageParam[] = [
      {
        role: LLMClient.ROLE_SYSTEM,
        content: assistant.current ? assistant.current : "你没有既定角色，可以基于用户提问随意发挥。",
      },
      {
        role: LLMClient.ROLE_USER,
        content: userContent,
      },
    ];
    console.log('messages',messages)
    return messages;
  };

  /**
   * 遍历用户会话列表，找出还没有进行过初始化命题的会话进行重命名，规则：取用户输入的前20
   * @param conversationKey 当前激活的会话Key
   * @param userContent 用户输入内容
   */
  const onRenameConversation = (
    conversationKey: string,
    userContent: string,
    part: number = 20
  ) => {
    /* 更新会话标题 */
    setConversations((prev) => {
      let item = prev.find((conver) => conver.key === conversationKey);
      // 如果初始化标题的话，截取前part个字符并更新标
      if (item && item.init) {
        item.init = false;
        item.label = processContent(userContent, false).substring(0, part);
      }
      return prev;
    });
  };

  /**
   * 初始一个带有唯一消息ID的回调消息空对象
   * @param messageId 消息ID，这个是在前端生成的唯一Key，openai返回的消息ID是后台的，注意甄别
   */
  const onInitCallBackMessage = (messageId: number): LLMCallBackMessage => {
    return {
      id: messageId,
      role: LLMClient.ROLE_AI,
      model: llmInfo?.modelName ?? "",
      choices: [],
    };
  };

  const onLLMChatStream = async (
    messageId: number,
    conversationKey: string,
    userContent: string,
    abortControllerRef: AbortController
  ) => {
    if (llmClient.current) {
      let messages = onInitMessageContent(userContent);
      // 万事俱备，直接开搞，发起流式聊天
      await llmClient.current.chatStreamLLMV2(
        messages,
        onMessageContentCallBack,
        onCallToolCallBack,
        onCallToolResultCallBack,
        onInitCallBackMessage(messageId),
        abortControllerRef
      );
      setLoading(false);
      onRenameConversation(conversationKey, userContent);
    } else {
      setLoading(false);
    }
  };

  // ==================== Runtime ====================
  // useXAgent: 模型调度
  const [agent] = useXAgent<BubbleDataType>({
    /**
            属性            说明                             类型
          request   配置自定义请求，支持流式更新             RequestFn
          RequestFn 有三个参数
          1.  info: RequestFnInfo<Message, Input>,
          2.  callbacks: {
                    onUpdate: (chunk: Output) => void;
                    onSuccess: (chunks: Output[]) => void;
                    onError: (error: Error) => void;
                    onStream?: (abortController: AbortController) => void;
                },
          3.  transformStream?: XStreamOptions<Message>['transformStream'],
    */
    request: async ({ message }, { onError }) => {
      try {
        if (!apiState.current) {
          adxMessage.error(
            "API服务不可用，请检查配置的API Key和Base URL是否正确！"
          );
          return;
        }
        abortController.current = new AbortController();
        setLoading(true);
        // 获取当前激活的会话Key
        const _currentConversation = curConversation.current;
        // 获取当前用户Input内容
        const userContent = message?.content ?? "";
        if (userContent === "") {
          setLoading(false);
          return;
        }
        // 初始化用户信息
        onInitMessage(
          getTimeKey(),
          LLMClient.ROLE_USER,
          _currentConversation,
          userContent
        );
        /** 这个地方一定要 + 1000 * ？毫秒数，以防止和上述用户的消息key在同一时刻相同了（demo的时候复现了好几次） */
        let messageId = getTimeKey(5000);
        // 初始化ai聊天信息，先占个位置
        onInitMessage(
          messageId,
          LLMClient.ROLE_AI,
          _currentConversation,
          "",
          true
        );
        // 发起流式问答(一定要带上messageId，后续展示消息列表时，这个消息ID很有用)
        await onLLMChatStream(
          messageId,
          _currentConversation,
          userContent,
          abortController.current
        );
      } catch (error: any) {
        adxMessage.error("Request error: " + error);
        // 异常标记
        apiState.current = false;
        console.error("Request error:", error);
        onError(error);
        setLoading(false);
      }
    },
  });

  /**
   * 从useXChat[数据管理]中获取请求函数、消息列表...etc
   * XChatConfigReturnType:
   * onRequest: 添加一条 Message，并且触发请求，若无 key为message 的数据则会将整个数据做为消息处理
   * messages : 当前管理的数据
   * setMessages：直接修改 messages，不会触发请求
   */
  const { onRequest, messages, setMessages } = useXChat({
    agent,
    // 请求失败的兜底信息，不提供则不会展示
    requestFallback: (_, { error }) => {
      let content = "";
      if (error.name === "AbortError") {
        content = "Request is aborted";
      } else {
        content = "Request failed, please try again!";
      }
      return {
        content,
        role: LLMClient.ROLE_AI,
      };
    },
  });

  // 构建当前聊天会话的助手角色选项
  const buildAiPromptOptions = () => {
    let options:any = [];
    aiPrompts.forEach((prompt) => {
      options.push({
        value: prompt.content,
        label: prompt.name,
        key: prompt.id,
      });
    });
    return options;
  };

   const changeAssitant = (value: string) => { 
      assistant.current = value;
      message.info(`当前助手角色已切换为：${value}`);
   }

  // ==================== Event ====================
  const onSubmit = (val: string) => {
    if (!val) return;
    if (loading) {
      adxMessage.error("当前回答还在进行中，请完成后再发起下一轮问答！");
      return;
    }
    // 如果useXAgent在useXChat中使用的话，必须使用下面这种方式触发消息问答
    onRequest({
      stream: true,
      message: { role: LLMClient.ROLE_USER, content: val, timed: Date.now() },
    });
  };

  // ==================== Render =================
  return (
    <div className={styles.layout}>
      <ChatConversationMG
        messageHistory={messageHistory}
        abortController={abortController?.current}
        conversations={conversations}
        setConversations={setConversations}
        curConversationKey={curConversation.current}
        setCurConversation={setCurrentConversation}
        setMessages={setMessages}
      />
      <div className={styles.chat}>
        {messageHistory[curConversation.current]?.length > 0 && (
          <div className={styles.assistant}>
            <Space>
              <label>请选择助手角色：</label>
              <Select
                style={{ width: 120 }}
                placeholder="请选择一个合适的LLM模型进行聊天！"
                options={buildAiPromptOptions()}
                onChange={changeAssitant}
                defaultValue={"生态助手"}
              />
            </Space>
          </div>
        )}
        <ChatBubbleList
          curConversation={curConversation.current}
          messageHistory={messageHistory}
          onMessageSend={onSubmit}
          onSetLLM={onSetLLMInfo}
        />
        <ChatMessageSender
          abortController={abortController?.current}
          onMessageSend={onSubmit}
          loading={loading}
          clearMessageHistory={clearMessageHistory}
          tools = {mcpTools}
        />
      </div>
    </div>
  );
};

export default ChatBox;
