import { mcpServer } from "@/common/config/sysConfig";
import { useAppSelector } from "@/store/hooks";
import LLMClient from "@/typing/llm/LLMClient";
import McpClient from "@/typing/llm/McpClient";
import LLMMessage from "@/typing/llm/response/LLMMessage";
import LLMStreamChoiceDelta from "@/typing/llm/response/LLMStreamChoiceDelta";
import LLMStreamChoiceDeltaTooCall from "@/typing/llm/response/LLMStreamChoiceDeltaTooCall";
import Tool from "@/typing/llm/Tool";
import { Button, Divider, Space } from "antd";
import {
  ChatCompletionChunk,
} from "openai/resources/index";
import { FC, useEffect, useState } from "react";

const DataRetrieval: FC<{}> = ({ }) => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [content, setContent] = useState<string>("");
  const [thinkContent, setThinkContent] = useState<string>("");
  const [callRsult, setCallResult] = useState<string>("");
  const [toolCalls, setToolCalls] = useState<any[]>([]);
  const [mcpClient, setMcpClient] = useState<McpClient>();
  const { messages } = useAppSelector(state => state.aiMessage)
  useEffect(() => {
    const asyncFun = async () => {
      await initialize();
    };
    asyncFun();
  }, []);

  /** 初始化并建立连接*/
  const initialize = async () => {
    if (!mcpClient) {
      let mcpClient = new McpClient();
      await mcpClient.connect2Server(mcpServer);
      setMcpClient(mcpClient);
    }
  };

  /** 获取服务端工具列表 */
  const getMcpTools = async () => {
    if (mcpClient) {
      let tools = await mcpClient.getTools();
      setTools(tools);
      console.log("Tools:", tools);
      return tools;
    } else {
      return [];
    }
  };

  const clearContext = () => {
    setThinkContent("")
    setContent("")
    setCallResult("")
    setToolCalls([])
  }

  /** 聊天(非流式) */
  const onLLMChat = async () => {
    clearContext();
    let llm = new LLMClient();
    const tools = await getMcpTools();
    let res = await llm.chatLLM("请帮我查询下当前苏州的天气？", tools);
    let message = res.choices[0].message as LLMMessage;
    setContent(message.content);
    setThinkContent(message.reasoning_content ?? "");
  };

  /** 聊天(流式) */
  const onLLMChatSteam = async () => {
    clearContext();
    let llm = new LLMClient();
    const tools = await getMcpTools();
    // await llm.chatStreamLLM(messages, tools, onMessageCallBack, onToolCallCallBack);
    await llm.chatStreamLLM(messages, [], onMessageCallBack, onToolCallCallBack);
  };

  /**
   * 流式聊天回调函数，这个函数结束取决于choice的finish_reason为："stop"
   * 如果是"tool_calls"，则表示是工具调用,则需要再发起一轮
   * @param chunk
   */
  const onMessageCallBack = (chunk: ChatCompletionChunk) => {
    const { choices } = chunk;
    if (choices && choices.length > 0) {
      const delta = choices[0].delta as LLMStreamChoiceDelta;
      if (delta) {
        // 处理思考内容
        if (delta.reasoning_content) {
          setThinkContent((prev) => prev + delta.reasoning_content);
        }
        // 处理输出内容
        if (delta.content) {
          setContent((prev) => prev + delta.content);
        }
      }
    }
  };

  /** 函数执行回调 */
  const onToolCallCallBack = (toolCalls: LLMStreamChoiceDeltaTooCall[]) => {
    if (toolCalls && toolCalls.length > 0) {
      setToolCalls(toolCalls)
      onCallTool(toolCalls[0]);
    }
  }

  /** 工具调用 */
  const onCallTool = async (tool: any) => {
    if (mcpClient) {
      let result: any = await mcpClient.callTool(tool);
      console.log("result:", result);
      setCallResult(result.content[0].text);
    }
  };

  return (
    <>
      <div>
        {tools.length > 0 &&
          tools.map((tool: Tool, index: number) => {
            return (
              <Space direction="vertical" key={index}>
                <div>方法名：{tool.name}</div>
                <div>方法描述：{tool.description}</div>
              </Space>
            );
          })}
      </div>
      <Divider />
      <div>
        <Space size="large">
          <Button type="primary" onClick={getMcpTools}>
            获取工具
          </Button>

          <Button type="primary" onClick={onLLMChat}>
            发起聊天
          </Button>

          <Button type="primary" onClick={onLLMChatSteam}>
            发起聊天(流式)
          </Button>

          <Button type="primary" onClick={onCallTool}>
            函数调用
          </Button>
        </Space>
        <Divider />
        <p>聊天思考过程：{thinkContent}</p>
        <Divider />
        <p>聊天执行结果：{content}</p>
        <Divider />
        <div>
          <p>工具选取情况</p>
          <Space>
            {toolCalls &&
              toolCalls.length > 0 &&
              toolCalls.map((toolCall: LLMStreamChoiceDeltaTooCall, index) => (
                <div key={index}>
                  <p>函数名称：{toolCall.function?.name}</p>
                  <p>函数参数：{toolCall.function?.arguments}</p>
                </div>
              ))}
          </Space>
        </div>
        <Divider />
        <p>函数调用结果：{callRsult}</p>
      </div>
    </>
  );
};

export default DataRetrieval;
