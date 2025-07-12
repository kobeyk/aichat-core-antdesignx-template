import LazyLoad from "@/common/components/router-wrapper/LazyLoad";
import NoPermissions from "@/pages/error/403";
import NotFound from "@/pages/error/404";
import { lazy } from "react";
import { Navigate } from "react-router-dom";
import dataRoutes from "./dataRoutes";
import { RouteMeta } from "../router/RouterRender";

const IndexRoutes = [
  {
    path: "/",
    element: LazyLoad(lazy(() => import("@/layout"))),
    children: [
      {
        path: "/",
        // 重定向, 登陆后直接进入/chat
        element: <Navigate to="/chat" />,
      },
      {
        path: "/chat",
        element: LazyLoad(lazy(() => import("@/pages/chat"))),
        meta: new RouteMeta("主页"),
      },
      dataRoutes,
      {
        path: "/403",
        element: <NoPermissions />,
      },
      {
        path: "/*",
        element: <NotFound />,
      },
    ],
  },
];

export default IndexRoutes;
