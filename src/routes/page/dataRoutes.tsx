import LazyLoad from "@/common/components/router-wrapper/LazyLoad";
import { Navigate } from "react-router-dom";
import { lazy } from "react";
import { RouteMeta } from "../router/RouterRender";
const dataRoutes = {
  path: "data",
  element: LazyLoad(lazy(() => import("@/pages/data"))),
  meta: new RouteMeta("数据管理"),
  children: [
    {
      path: "",
      element: <Navigate to={"./retrieval"}></Navigate>,
    },
    {
      path: "manage",
      element: LazyLoad(lazy(() => import("@/pages/data/data-manage"))),
      meta: new RouteMeta("数据管理"),
    },
  ],
};

export default dataRoutes;
