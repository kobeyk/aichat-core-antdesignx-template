/** 后台响应结果封装 */
export default interface GxResult{
    /** 响应状态码 */
    status?:number;
    /** 响应消息 */
    message?:string;
    /** 响应数据 */
    data?:any;
    /** 响应服务器时间精确到秒 */
    timestamp?:string;
}