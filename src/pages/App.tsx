import RouterGuard from "@/common/components/router-wrapper/RouterGuard";
import routesConfig from "@/routes";
import { Router } from "@/routes/router/RouterRender";
import { App } from "antd";
import { FC, ReactElement } from "react";
import { HashRouter } from "react-router-dom";
/** 整个应用的父组件 */
const AppIndex: FC = (): ReactElement => {

  return (
    /* 包裹组件 地址：https://ant.design/components/app-cn#%E5%A6%82%E4%BD%95%E4%BD%BF%E7%94%A8*/
    <App>
      <HashRouter future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}>
        {/* 路由守卫（认证+鉴权），基于路由的拦截器 */}
        <RouterGuard key="guard">
          {/* 渲染路由组件 */}
          <Router routes={routesConfig} />
        </RouterGuard>
      </HashRouter>
    </App>
  );
};
export default AppIndex;
