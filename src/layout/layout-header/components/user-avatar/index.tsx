import { Avatar, Dropdown,Space } from "antd";
import { MenuProps } from "antd/lib";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "@/common/config/sysConfig";
import avatarJPG from "@/assets/images/avatar.jpg"
import { useAppSelector } from "@/store/hooks";
import "./index.scss";

export default function UserAvatar() {
  const navigate = useNavigate();
  /** 获取当前用户所处的位置对象 */
  const curUser = useAppSelector((state) => state.user.account);
  const _logout = async () => {
    try {
    } catch (err) {}
  };

  const items: MenuProps["items"] = [
    {
      key: "userCenter",
      label: "个人中心",
      onClick: () => {
        window.open('https://ant-design-x.antgroup.com/');
      },
    },
    {
      key: "manage",
      label: "后台管理",
      onClick: () => {
        navigate("/manage/userlist");
      },
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      label: "退出登录",
      onClick: () => {
        _logout();
      },
    },
  ];

  return (
    <Dropdown menu={{ items }} trigger={["click"]}>
      <Space className="user-avatar">
        <Avatar size="large" src={avatarJPG} />
        <span className="user-avatar-name">{curUser?.alias}</span>
      </Space>
    </Dropdown>
  );
}
