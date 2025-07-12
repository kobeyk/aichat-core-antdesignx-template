import { AppstoreOutlined, MailOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import React from "react";
type MenuItem = Required<MenuProps>["items"][number];
function getItem(
  label: React.ReactNode, // 标签名称
  key: React.Key, // 路由key
  icon?: React.ReactNode, // 图标
  children?: MenuItem[], // 子路由
  purview?: number[] // 权限
): MenuItem {
  return {
    label,
    key,
    icon,
    children,
    purview,
  } as MenuItem;
}
export const DataMenu = [
  getItem("数据查询", "/data/retrieval",),
  getItem("数据管理", "/data/manage"),
];

/** 顶部导航菜单 */
export const HeaderMenu = [
  getItem("聊天", "/home",<MailOutlined/>),
  getItem("数据", "/data",<AppstoreOutlined/>, DataMenu),
];

