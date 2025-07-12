import allRoutes from "@/routes";
import { getFlatRoutes } from "@/routes/router/RouterRender";
import { useLocation, useSearchParams } from "react-router-dom";

/** 项目启动时，全局仅一次获取扁平化的路由列表 */
const flatRoutes = getFlatRoutes(allRoutes);

/** 路由守卫函数（用户认证+用户鉴权）*/
const RouterGuard = ({ children }: { children: JSX.Element }) => {
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();

  /** 这个地方可以做一些业务相关的 */

  /** 匹配当前pathname对应的路由对象(可能有多个) */
  const routeObjects = flatRoutes.filter(
    (item) => pathname === item.path
  );
  /** 当前路由对象 */
  let currentRoute;
  /** 当前路由所需要的对象域 */
  let scope;
  /** 当前路由所需的用户权限列表 */
  let purview;
  /** 当前路由所需的用户角色列表 */
  let role;

  /** 获取当前路由的鉴权元信息 */
  if (routeObjects && routeObjects.length > 0) {
    currentRoute = routeObjects[0];
    scope = currentRoute.scope;
    purview = currentRoute.purview;
    role = currentRoute.role;
  }

  /** 1、对象域匹配 */
  if (scope) {
  }

  /** 2、权限匹配 */
  if (purview && purview.length > 0) {
  }

  /** 3、角色匹配 */
  if (role && role.length > 0) {
  }

  /** 组件放行 */
  return children;
};
export default RouterGuard;
