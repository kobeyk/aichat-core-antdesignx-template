
const systemTitle = window.systemTitle;
const baseUrl = window.baseUrl;
const apiKey = window.apiKey;
const model = window.model;
const mcpServer = window.mcpServer;
const defaultLLM = window.defaultLLM;
const defaultModelName = window.defaultModelName;
const abortRequestMessage = "您已取消当前请求，本次消息响应终止！"
const LLMNames = {
    ollama: "ollama",
    deepseek: "deepseek",
}
const ModelNames = {
    ollama: "deepseek-r1:8b-0528-qwen3-fp16",
    deepseek: "deepseek-reasoner",
}
const useMockData = 1;   // 0 不启用mock数据 ， 1启用mock数据
export {
    systemTitle,
    baseUrl,
    apiKey,
    model,
    mcpServer,
    ModelNames,
    LLMNames,
    defaultLLM,
    defaultModelName,
    abortRequestMessage,
    useMockData
};

