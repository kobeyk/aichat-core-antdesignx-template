import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ChatCompletionMessageParam } from "openai/resources/index";

/** 定义哪些状态需要被全局共享 */
export interface AIMessageState {
    /**当前登录的用户 */
    messages: ChatCompletionMessageParam[];
}

/** 初始化全局共享的状态对象 */
const initialState: AIMessageState = {
    messages: [
        {
            role: "system",
            content: "你是一个天气查询助手，请基于用户需求查询指定地点的即时天气。",
        },
        {
            role: "user",
            content: "请帮我查询下当前苏州的天气？",
        },
    ]
};

/** 创建一个（全局状态共享）数据切片 */
const messageSlice = createSlice({
    name: "aiMessage",
    initialState,
    /** 同步reducer（相较于之前的react-redux，这里是把reducer和action整合到了一起） */
    reducers: {
        setMessages(state: AIMessageState, action: PayloadAction<ChatCompletionMessageParam[]>) {
            state.messages = action.payload;
        },
    },
});

/** 导出同步action，注：异步action已经导出，外部直接调用即可 */
export const { setMessages } = messageSlice.actions;
/** 导出reducer */
export default messageSlice.reducer;