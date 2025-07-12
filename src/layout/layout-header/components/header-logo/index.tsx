import { Flex } from "antd";
import logo from "@/assets/images/logo.png";
import { useNavigate } from "react-router-dom";
import "./index.scss";

export default function HeaderLogo({ title }: { title: string }) {
  const navigate = useNavigate();
  return (
    <Flex
      gap={30}
      className="header-logo-container"
      onClick={() => {
        navigate("/");
      }}
    >
      <img className="header-logo" src={logo} />
      <h1 className="header-title" onClick={()=>window.open("https://space.bilibili.com/452968297?spm_id_from=333.1007.0.0")}>{title}</h1>
    </Flex>
  );
}
