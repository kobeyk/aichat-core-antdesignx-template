import { useRoutes } from "react-router-dom";

/**
 * 获取扁平化的侧边栏路由列表对象
 * @param menuItems  结构化的菜单路由对象
 * @param arr 最终要返回的扁平化路由列表
 * @returns []
 */
export const getFlatMenuRoutes = (
  menuItems: any,
  arr: any = []
): Array<{ name: string; label: string; path: string }> => {
  if (!(menuItems instanceof Array)) {
    return [];
  }
  menuItems.forEach((item: any) => {
    /** 这个地方得判断下,菜单项里面有可能是这种的{type: 'divider'} */
    if (item.key) {
      let name = item.key.split("/").filter(Boolean).join("");
      arr.push({ ...item, name: name, path: item.key });
      /** 递归遍历路由的children */
      if (item.children) {
        getFlatMenuRoutes(item.children, arr);
      }
    }
  });
  return [...arr];
};

/**
 * 获取扁平化的路由列表对象
 * @param routes  结构化的路由对象
 * @param arr 最终要返回的扁平化路由列表
 * @param parentPath 父级路由路径
 * @returns []
 */
export const getFlatRoutes = (
  routes: IRouteObject[],
  arr: IFlatRouteObject[] = [],
  parentPath?: string
): IFlatRouteObject[] => {
  if (!(routes instanceof Array)) {
    return [];
  }
  routes.forEach((item) => {
    // 拼接路由路径
    let routesPath = parentPath ? `${parentPath}/${item.path}` : item.path;

    arr.push({
      name: item.meta ? item.meta.title : "",
      path: routesPath,
      /**下面就是用户能否进入当前路由页的认证信息 */
      scope: item.meta ? item.meta.scope : 1,
      purview: item.meta ? item.meta.purview : [],
      role: item.meta ? item.meta.role : [],
    });
    if (item.children) {
      // 递归调用
      getFlatRoutes(item.children, arr, routesPath == "/" ? "" : routesPath);
    }
  });
  return [...arr];
};

/**
 * 路由元信息（业务所需要的属性信息）
 * 鉴权方面：用户是否具有某一角色或者权限才可以访问当前路由页面
 */
export class RouteMeta {
  /** 路由标题 */
  title?: string = "";
  /** 默认系统域 */
  scope?: number = 1;
  /** 当前路由匹配的用户权限列表 */
  purview?: number[] = [];
  /** 当前路由匹配的用户角色列表 */
  role?: number[] = [];
  constructor(title: string, purview: number[] = [], role: number[] = []) {
    this.title = title;
    this.purview = purview;
    this.role = role;
  }
}

/** 定义扁平化路由对象 */
export interface IFlatRouteObject {
  /** 路由名称 */
  name?: string;
  /** 路由路径 */
  path?: string;
  /** 路由地址对应的对象域（组织or系统） */
  scope?: number;
  /** 路由匹配的用户权限列表 */
  purview?: number[];
  /** 路由匹配的用户角色列表 */
  role?: number[];
}

//自定义路由业务属性
export interface IRouteObject {
  /** 是否区分大小写 */
  caseSensitive?: boolean;
  /** 子路由 */
  children?: IRouteObject[];
  /** 路由组件 */
  element?: React.ReactNode;
  index?: boolean;
  /** 路由地址 */
  path?: string;
  /** ----------上面是react-router-dom 必带的-------------- */
  /** ----------下面是我们业务系统需要的一些路由额外元信息-------------- */
  meta?: RouteMeta;
}

/** 动态创建路由（<Routes>和<Route>） */
export const Router = ({ routes }: { routes: any }) => useRoutes(routes);
