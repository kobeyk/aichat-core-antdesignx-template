import { baseUrl } from "@/common/config/sysConfig";
import { axiosFn, toFormData } from "@/services/api/request";

/** 用户登录 */
export interface LoginUser {
  appId?: number;
  userName: string;
  password: string;
}

/** 用户注册 */
export interface RegistUser {
  userName: string;
  password: string;
  rePassword: string;
  codeType?: number;
  code?: string;
}

// 用户认证中心Service
const userCenterService = {
  /** local模式的用户登录 */
  login: (data: LoginUser) => {
    return new Promise((reslove, reject) => {
      axiosFn.postByForm("/auth/login", toFormData(data)).then(
        (res) => {
          reslove(res);
        },
        (reason) => reject(reason)
      );
    });
  },
  /** 用户注册 */
  register: (data: RegistUser) => {
    return new Promise((reslove, reject) => {
      axiosFn.postByJson("/auth/register", data).then(
        (res) => {
          reslove(res);
        },
        (reason) => reject(reason)
      );
    });
  },
  /** 用户退出登录 */
  logout: () => {
    return new Promise((resolve, reject) => {
      axiosFn.postByJson(baseUrl + "/auth/logout").then(
        (res) => {
          resolve(res);
        },
        (reason) => reject(reason)
      );
    });
  },
  /** 获取用户信息 */
  getUser: () => {
    return new Promise((resolve, reject) => {
      axiosFn.postByJson(baseUrl + "/auth/getUser").then(
        (res) => {
          resolve(res);
        },
        (reason) => reject(reason)
      );
    });
  },
  /** 以用户令牌的方式进行登录（这种模式是sso-client模式，local模式时用不到） */
  loginToken: () => {
    return new Promise((resolve, reject) => {
      axiosFn.getByJson(baseUrl + "/auth/loginToken").then(
        (res) => {
          resolve(res);
        },
        (reason) => {
          reject(reason);
        }
      );
    });
  },
};
export default userCenterService;
