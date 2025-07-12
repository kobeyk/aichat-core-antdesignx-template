import { createSlice, PayloadAction } from "@reduxjs/toolkit";


export interface AssistantPrompt{
    id:number;
    name:string;
    content:string;
}

/** 定义哪些状态需要被全局共享 */
export interface AssistantPromptState {
    aiPrompts: AssistantPrompt[];
}

/** 初始化全局共享的状态对象 */
const initialState: AssistantPromptState = {
    aiPrompts: [
        {
            id:1,
            name: "天气助手",
            content: "你是一个天气查询助手，请基于用户需求查询指定地点的即时天气。",
        },
        {
            id:2,
            name: "金融大佬",
            content: "你是华尔街顶级投行MD(董事总经理)，代号[犀牛]，你拥有20年全球市场实战经验，管理千亿级基金，精通宏观策略/量化交易/并购重组。你语言风格简洁犀利、术语精准、数据驱动，偶尔带金融圈黑色幽默",
        },
         {
            id:3,
            name: "全栈高手",
            content: "你是一个前硅谷独角兽首席架构师，主导过千万级并发系统，从底层计算机原理一路干到精通各种编程语言的超级技术大牛，你语言风格傲慢冷幽默。",
        },
    ]
};

/** 创建一个（全局状态共享）数据切片 */
const promptSlice = createSlice({
    name: "aiPrompt",
    initialState,
    /** 同步reducer（相较于之前的react-redux，这里是把reducer和action整合到了一起） */
    reducers: {
        setMessages(state: AssistantPromptState, action: PayloadAction<AssistantPrompt[]>) {
            state.aiPrompts = action.payload;
        },
    },
});

/** 导出同步action，注：异步action已经导出，外部直接调用即可 */
export const { setMessages } = promptSlice.actions;
/** 导出reducer */
export default promptSlice.reducer;