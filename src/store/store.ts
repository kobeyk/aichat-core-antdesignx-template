import { configureStore } from "@reduxjs/toolkit";
import userSlice from "@/services/slice/userSlice";
import promptSlice from "@/services/slice/promptSlice";
/**
 *  所有的数据切片都是按模块划分的，每一个数据切片可以理解为对一类
 *  业务数据的处理（同步+异步），处理的结果同步放到store中进行state状态管理
 *  如果其他页面组件需要这些数据，直接从store中取即可!
 *  注意：除非你真的需要用到数据切片的功能，否则不要轻易去尝试使用！
 */
export const store = configureStore({
  reducer: {
    user: userSlice,
    aiPrompt: promptSlice
  },
  /** 仅在开发环境下开启 */
  devTools: process.env.NODE_ENV !== "production",
  /** 关闭（state）序列化检测 */
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
