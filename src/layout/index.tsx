import { Layout } from "antd";
import LayoutContent from "./layout-content";
import LayoutHeader from "./layout-header";
import { useEffect } from "react";
import "./index.scss";
const Layouts = () => {
  useEffect(() => {
    /**
     * 可以在这个全局布局组件里面获取用户的角色和权限值，然后保存到store中
     * 后续鉴权的事情交给RouterGuard组件
     */
  }, []);
  return (
    <Layout className="layout">
      <LayoutHeader className="header" />
      <Layout.Content className="content">
        <LayoutContent />
      </Layout.Content>
    </Layout>
  );
};

export default Layouts;
