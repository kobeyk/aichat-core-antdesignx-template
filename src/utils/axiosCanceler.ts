import type { AxiosRequestConfig } from "axios";

interface UrlConfig{
  url:string,
  method:string
}
export class AxiosCanceler {

  static instance: null | AxiosCanceler = null;
  // 用于存储每个请求的标识和取消函数
  static pendingMap = new Map<string, AbortController>();

  public static getInstance() {
    if (this.instance == null) {
      this.instance = new AxiosCanceler();
    }
    return this.instance;
  }

  private getPendingUrl(config: AxiosRequestConfig | UrlConfig): string {
    return [config.method, config.url].join("&");
  }

  /**
   * 添加请求
   * 这个地方有个逻辑：重复的api只会发送一次，之前的会被取消
   * 但是这个不保证取消的请求不到后端，
   * @param config 请求配置
   */
  public addPending(config: AxiosRequestConfig): void {
    /*** 检查是否存在重复请求，如有取消 */
    this.removePending(config);
    const url = this.getPendingUrl(config);
    const controller = new AbortController();
    config.signal = controller.signal;
    if (!AxiosCanceler.pendingMap.has(url)) {
      // 如果当前请求不在等待中，将其添加到等待中
      AxiosCanceler.pendingMap.set(url, controller);
    }
  }

  public hasPending(config: AxiosRequestConfig):boolean{
    const url = this.getPendingUrl(config);
    if (AxiosCanceler.pendingMap.get(url)) {
        return true;
    }
    return false;
  }

  /**
   * 清除（取消）所有等待中的请求
   */
  public removeAllPending(): void {
    AxiosCanceler.pendingMap.forEach((abortController) => {
      if (abortController) {
        abortController.abort();
      }
    });
    this.reset();
  }

  /**
   * 取消请求（取消的含义仅仅是前端忽略后端返回的结果，请求取消后，后端业务逻辑还会继续执行）
   * 场景就是请求比较耗时，如果多次点击，会出现大量pending，这时候可以取消重复的，只保留最后一次
   * @param config 请求配置,可以是axios自己的也可以是我们自定义的UrlConfig
   */
  public removePending(config: AxiosRequestConfig|UrlConfig): void {
    const url = this.getPendingUrl(config);
    if (AxiosCanceler.pendingMap.has(url)) {
     
      // 如果当前请求在等待中，取消它并将其从等待中移除
      const abortController = AxiosCanceler.pendingMap.get(url);
      if (abortController) {
        abortController.abort(url);
      }
      AxiosCanceler.pendingMap.delete(url);
    }
  }

  /**
   * 清空还未得到响应结果的请求map映射
   */
  public reset(): void {
    AxiosCanceler.pendingMap.clear();
  }
}
