import NProgress from "@/common/config/nprogress";
import { baseUrl } from "@/common/config/sysConfig";
import SnResult from "@/typing/extra/SnResult";
import { AxiosCanceler } from "@/utils/axiosCanceler";
import { message, notification } from "antd";
import axios, {
  AxiosError,
  AxiosProgressEvent,
  AxiosRequestConfig,
  CancelToken,
  InternalAxiosRequestConfig,
} from "axios";
import React from "react";
import userCenterService from "../impl/userCenterService";

/** 默认系统位置，如果涉及到一些接口需要传特定位置的话，记得更新 */
const defaultPosConfig = {
  posId: 0,
  posOtId: 0,
};

const axiosInstance = axios.create({
  baseURL: baseUrl,
  timeout: 300 * 1000,
});

/** 当前请求的配置 */
let currentConfig: AxiosRequestConfig = {};

/** 请求拦截器 */
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // if (AxiosCanceler.getInstance().hasPending(config)) {
    //   /** 返回一个问题config，阻止重复的请求流转到后端 */
    //   AxiosCanceler.getInstance().removePending(config);
    //   message.error("请求频次");
    // }
    /**开启进度条 */
    NProgress.start();
    // 将请求缓存起来，方便后续取消
    // AxiosCanceler.getInstance().addPending(config);
    // 记录下当前的请求配置
    currentConfig = config;
    // Do something before request is sent
    let token = getToken();
    if (token) config.headers["token"] = token;
    //重新刷新路由，会进行token验证并会重定向到登录页，else不需要处理
    return config;
  },
  (error) => {
    // Do something with request error
    // AxiosCanceler.getInstance().removePending(currentConfig);
    message.error(error.message);
    return Promise.reject(error);
  }
);

/** 响应拦截器 */
axiosInstance.interceptors.response.use(
  (res: any) => {
    /** 请求结束后移除进度条 */
    NProgress.done();
    //在请求结束后，移除本次请求
    // AxiosCanceler.getInstance().removePending(currentConfig);
    checkAuth(res.data.status ? res.data.status : 200, res.data.message);
    return res.data;
  },
  (error: AxiosError) => {
    NProgress.done();
    AxiosCanceler.getInstance().removePending(currentConfig);
    /**
     * Any status codes that falls outside the range of 2xx cause this function to trigger
     * 任何超出2xx范围的状态码都会触发此函数
     * Do something with response error
     */
    if (error.message !== "文件上传取消" && error.message !== "文件下载取消") {
      message.error(error.message);
    }
    return Promise.reject(error);
  }
);
const checkAuth = (status: number, msg: string): void => {
  switch (status) {
    case 10201: // 对应后台：拒绝访问（用户认证信息不合法，请检查用户登录情况）
    case 10202: // 对应后台：用户认证失败
    case 10203: // 对应后台：非法的用户认证信息
    case 10204: // 对应后台：用户令牌过期
      // 后面不够再加
      message.error(msg);
      userCenterService.logout();
      setTimeout(() => {
        redirectLogin();
      }, 2000);
      break;
    default:
      break;
  }
};

/**
 * 设置token
 * 说明：如果不传参数或参数为null，则会清除所有
 */
const setToken = (token?: string) => {
  const _oldToken = localStorage.getItem("token");
  if (token) {
    localStorage.setItem("token", token);
  } else localStorage.clear();
  return _oldToken ? _oldToken : null;
};
const getToken = () => {
  let token = localStorage.getItem("token");
  return token ? token : null;
};

/**
 * 重定向登录页面
 */
const redirectLogin = () => {
  // if (mode === "sso") {
  //   window.location.href = loginUrl + "#/login?appId=" + appId;
  // } else {
  //   window.location.href = loginUrl + "#/login";
  // }
};

/** 对象转表单 */
const toFormData = (option: any) => {
  let formData = new FormData();
  for (let key in option) {
    formData.append(key, option[key]);
  }
  return formData;
};

/** 下载blob转存到本地指定文件 */
const downLoadBlob = (
  res: any,
  fileName: string,
  resolve: any,
  el?: React.ReactNode
) => {
  const blob = new Blob([res.data], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8",
  });
  const aEle = document.createElement("a"); // 创建a标签
  const href = window.URL.createObjectURL(blob); // 创建下载的链接
  aEle.href = href;
  aEle.download = fileName; // 下载后文件名
  document.body.appendChild(aEle);
  aEle.click(); // 点击下载
  document.body.removeChild(aEle); // 下载完成移除元素
  window.URL.revokeObjectURL(href); // 释放掉blob对象
  resolve(res);
  notification.success({
    message: `文件${fileName},导出成功!`,
    icon: el,
    placement: "bottomLeft",
    duration: 5,
  });
};

/** 统一定义axios请求方法格式，封装成一个函数 */
const axiosFn = {
  // 传入FormData数据进行get请求
  getByForm: (
    url: string,
    params: any,
    posId: number | string = defaultPosConfig.posId,
    posOtId: number | string = defaultPosConfig.posOtId
  ): Promise<SnResult> => {
    return axiosInstance.get(url, {
      params: params,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "GxUser-PosOtype": posOtId,
        "GxUser-PosOid": posId,
      },
    });
  },

  // 传入json数据进行get请求
  getByJson: (
    url: string,
    params: any = {},
    posId: number | string = defaultPosConfig.posId,
    posOtId: number | string = defaultPosConfig.posOtId
  ): Promise<SnResult> => {
    return axiosInstance.get(url, {
      params: params,
      headers: {
        "Content-Type": "application/json",
        "GxUser-PosOtype": posOtId,
        "GxUser-PosOid": posId,
      },
    });
  },

  // 基于url进行get请求
  getByUrl: (
    url: string,
    posId: number | string = defaultPosConfig.posId,
    posOtId: number | string = defaultPosConfig.posOtId
  ): Promise<SnResult> => {
    return axiosInstance.get(url, {
      headers: {
        "Content-Type": "application/json",
        "GxUser-PosOtype": posOtId,
        "GxUser-PosOid": posId,
      },
    });
  },

  //传入FormData数据进行post请求
  postByForm: (
    url: string,
    data: any,
    posId: number | string = defaultPosConfig.posId,
    posOtId: number | string = defaultPosConfig.posOtId
  ): Promise<SnResult> => {
    return axiosInstance.post(url, data, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "GxUser-PosOtype": posOtId,
        "GxUser-PosOid": posId,
      },
    });
  },
  //传入json数据进行post请求
  postByJson: (
    url: string,
    data = {},
    posId: number | string = defaultPosConfig.posId,
    posOtId: number | string = defaultPosConfig.posOtId
  ): Promise<SnResult> => {
    return axiosInstance.post(url, data, {
      headers: {
        "Content-Type": "application/json",
        "GxUser-PosOtype": posOtId,
        "GxUser-PosOid": posId,
      },
    });
  },
  /** 基于资源的ID进行删除 */
  deleteById: (
    url: string,
    id: number,
    posId: number | string = defaultPosConfig.posId,
    posOtId: number | string = defaultPosConfig.posOtId
  ): Promise<SnResult> => {
    return axiosInstance.delete(`${url}/${id}`, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "GxUser-PosOtype": posOtId,
        "GxUser-PosOid": posId,
      },
    });
  },
  /** 以表单方式上传文件*/
  upload: (
    url: string,
    data: any = {},
    onUploadProgress?: (progressEvent: AxiosProgressEvent) => void,
    cancelToken?: CancelToken,
    posId: number | string = defaultPosConfig.posId,
    posOtId: number | string = defaultPosConfig.posOtId
  ): Promise<SnResult> => {
    return axiosInstance.post(url, data, {
      onUploadProgress,
      cancelToken: cancelToken,
      headers: {
        "Content-Type": "multipart/form-data",
        "GxUser-PosOtype": posOtId,
        "GxUser-PosOid": posId,
      },
    });
  },

  /**
   * 将资源导出到文件中
   * @param {URL} url 资源标识
   * @param {String} fileName 文件名
   * @param {long} posId 接口所在位置ID
   * @param {long} posOtId 接口所在位置类型
   * @returns
   */
  export: (
    url: string,
    fileName: string,
    posId: number | string = defaultPosConfig.posId,
    posOtId: number | string = defaultPosConfig.posOtId,
    onDownloadProgress: (progressEvent: AxiosProgressEvent) => void,
    cancelToken?: CancelToken,
    el?: React.ReactNode
  ): Promise<SnResult> => {
    return new Promise((resolve) => {
      axios({
        baseURL: baseUrl,
        url: url,
        method: "get",
        responseType: "blob",
        onDownloadProgress: onDownloadProgress,
        cancelToken: cancelToken,
        headers: {
          token: getToken(),
          "GxUser-PosOtype": posOtId,
          "GxUser-PosOid": posId,
        },
      }).then((res) => {
        downLoadBlob(res, fileName, resolve, el);
      });
    });
  },
};

export default axiosInstance;
export { setToken, getToken, redirectLogin, toFormData, axiosFn };
