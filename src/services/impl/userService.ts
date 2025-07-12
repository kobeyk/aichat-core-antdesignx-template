import { axiosFn } from "@/services/api/request";
import { SnUser } from "@/typing";
import SnResult from '@/typing/extra/SnResult';

// 用户业务Service实现，主要负责与服务单进行数据交换
const userService = {
  /** 获取用户列表（系统） */
  getUser: (data:SnUser): Promise<SnResult> => {
    return new Promise((reslove) => {
      axiosFn
        .postByJson("/core/user/query", data)
        .then((res) => {
          reslove(res);
        });
    });
  },

  /** 基于位置获取当前用户信息,默认不传为系统 */
  getCurrentUser: (posId:number = 0, posOtId:number = 0): Promise<SnResult> => {
    return new Promise((reslove, reject) => {
      axiosFn.postByJson("/core/user/mydetail", {}, posId, posOtId).then(
        (res) => { reslove(res); },
        (res) => { reject(res) });
    });
  },
};
export default userService;