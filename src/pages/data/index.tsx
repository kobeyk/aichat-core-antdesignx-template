import { getFlatMenuRoutes } from "@/routes/router/RouterRender";
import { useEffect, useState } from "react";
import { DataMenu } from "@/routes/menu/menuItems";
import { useNavigate, useLocation, Outlet } from "react-router-dom";

const Data = () => {
  const [activeKey, setActiveKey] = useState("");
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    const flatMenuRoutes = getFlatMenuRoutes(DataMenu); // 获取侧边栏扁平化路由对应的菜单对象
    let activeMenuRoute = flatMenuRoutes.find((menuItem) =>
      pathname.startsWith(menuItem.path)
    );
    if (activeMenuRoute) {
      setActiveKey(activeMenuRoute.path);
    } else {
      setActiveKey("");
    }
  }, [pathname]);

  return (
    <div>
      <Outlet />
    </div>
  );
};

export default Data;
