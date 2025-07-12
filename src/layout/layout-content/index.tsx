import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import "./index.scss";
const {Content} = Layout
const LayoutContent = () => {
    return (
        <Content className="layout-content">
          {/* 渲染子路由 */}
          <Outlet />
        </Content>
      )
}
export default LayoutContent