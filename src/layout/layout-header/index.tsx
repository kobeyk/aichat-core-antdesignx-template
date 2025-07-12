import { useEffect, useState } from "react";
import { Layout, Menu, Flex } from "antd";
import { HeaderMenu } from "@/routes/menu/menuItems";
import UserAvatar from "./components/user-avatar";
import { getFlatMenuRoutes } from "@/routes/router/RouterRender";
import { useLocation, useNavigate } from "react-router-dom";
import { systemTitle } from "@/common/config/sysConfig";
import HeaderLogo from "./components/header-logo";
import "./index.scss";

const { Header } = Layout;

const LayoutHeader = (props: { className?: string }) => {
  const [activeKey, setActiveKey] = useState<string>("");
  const [activeKeys, setActiveKeys] = useState<string[]>([]); // 用于多级菜单的选中状态
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    const flatMenuRoutes = getFlatMenuRoutes(HeaderMenu); // 获取侧边栏扁平化路由对应的菜单对象
    // 处理单级菜单选中状态
    let activeMenuRoute = flatMenuRoutes.find((menuItem) =>
      pathname.startsWith(menuItem.path)
    );

    if (activeMenuRoute) {
      setActiveKey(activeMenuRoute.path);
    } else {
      setActiveKey("");
    }
    // 处理多级菜单选中状态
    let activeMenuRoutes = flatMenuRoutes.filter((menuItem) => {
      return pathname.startsWith(menuItem.path);
    });
    if (activeMenuRoutes.length > 0) {
      setActiveKeys(activeMenuRoutes.map((item) => item.path));
    } else {
      setActiveKeys([]);
    }
  }, [pathname]);

  return (
    <Header {...props}>
      <Flex gap={30} flex={1}>
        <HeaderLogo title={systemTitle} />
        <div className="header-menu">
          {/* 这个组件在热更新时会出现不显示的问题 */}
          <Menu
            selectedKeys={activeKeys}
            mode={"horizontal"}
            items={HeaderMenu}
            onClick={(routeMenuItem) => {
              navigate(routeMenuItem.key);
            }}
          ></Menu>
        </div>
      </Flex>
      <div className="header-avatar">
        <UserAvatar />
      </div>
    </Header>
  );
};

export default LayoutHeader;
