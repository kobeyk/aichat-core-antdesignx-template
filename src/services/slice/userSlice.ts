import SnResult from "@/typing/extra/SnResult";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import userService from "../impl/userService";
import { SnUser } from "@/typing";

export interface PosObject {
  id: number;
  otid: number;
}

/** 定义哪些状态需要被全局共享 */
export interface UserState {
  /**当前登录的用户 */
  account?: SnUser;
}

/** 初始化全局共享的状态对象 */
const initialState: UserState = {
  account: new SnUser(),
};

/**
 * createAsyncThunk中间件，用于执行异步操作
 * <p>
 *   函数功能：基于位置获取当前用户信息（基本信息+角色+权限）
 *   然后获取的信息存入到当前数据切片的state中，供需要的组件直接获取
 * </p>
 * 参数1：类型前缀 （异步的返回结果是一个promise，then之后是一个action，
 *                 action的前缀就是我们第一个参数，然后基于promise状态，还会
 *                 在前缀的基础上添加 前缀/pending;前缀/fulfilled;前缀/rejected）
 * 参数2：传入一个函数, 该函数可以执行异步操作, 甚至可以直接传入一个异步函数
 * */
export const fetchCurrentUser = createAsyncThunk(
  "core/user/query",
  async (pos: PosObject) => {
    /**
     * 将查询结果返回出去，结果就是一个action，页面端拿到后进行处理
     * 处理1: 解构拿到payload
     *       let {payload}: any = await dispatch(getUsers(uFilter));
     * 处理2: 通过unwrap函数“拆解”action直接拿到data
     *       let res: any = await dispatch(getUsers(uFilter)).unwrap();
     */
    return userService.getCurrentUser(pos.id, pos.otid);
  }
);

/** 创建一个（全局状态共享）数据切片 */
const userSlice = createSlice({
  name: "user",
  initialState,
  /** 同步reducer（相较于之前的react-redux，这里是把reducer和action整合到了一起） */
  reducers: {
    setCurUser(state: UserState, action: PayloadAction<SnUser>) {
      state.account = action.payload;
    },
  },
  /** 监听异步action执行结果 */
  extraReducers: (builder) => {
    /**
     * 参数1：异步请求promise的状态（pending、fulfilled、rejected）
     * 参数2：回调函数，相当于同步的reducer
     */
    builder.addCase(
      fetchCurrentUser.fulfilled,
      (state: UserState, action: PayloadAction<SnResult>) => {
        state.account = action.payload.data;
      }
    );
  },
});

/** 导出同步action，注：异步action已经导出，外部直接调用即可 */
export const { setCurUser } = userSlice.actions;
/** 导出reducer */
export default userSlice.reducer;
