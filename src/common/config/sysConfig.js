
const systemTitle = window.systemTitle
const apiKey = window.apiKey
const baseUrl = window.baseUrl
const modelName = window.modelName
const mcpServer = window.mcpServer ? window.mcpServer : ""
const abortRequestMessage = "您已取消当前请求，本次消息响应终止！"
// 0 不启用mock数据 ， 1启用mock数据
const useMockData = 1
// 0 不启用日志打印 ， 1启用日志打印
const logDebug = 0
export {
    systemTitle,
    baseUrl,
    apiKey,
    mcpServer,
    modelName,
    abortRequestMessage,
    useMockData,
    logDebug
};