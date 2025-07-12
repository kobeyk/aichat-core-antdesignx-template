import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { store } from './store';

/** 自定义一些hooks函数，主要为了复用，少引用一些类型 */

/** 定义根dispatch类型 */
type RootDispatch = typeof store.dispatch;
/** 导出全局dispatch钩子函数 */
export const uesAppDispatch = ()=> useDispatch<RootDispatch>();

/** 定义根state类型 */
type RootState = ReturnType<typeof store.getState>;
/** 重新定义一个全局获取state状态数据的钩子函数，其等价于useSelector，只不过带了类型 */
export const useAppSelector:TypedUseSelectorHook<RootState> = useSelector;