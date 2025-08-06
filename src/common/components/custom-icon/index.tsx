import { createFromIconfontCN } from "@ant-design/icons";

/** 外网模式(为了方便开发用外网) */
const icon = createFromIconfontCN({
  scriptUrl: "//at.alicdn.com/t/c/font_4822249_srm9e5n58a.js",
});

/** 内网模式（内网发布，记得将iconfont项目中的图标js文件下载下来，放到public目录下一份） */
// export const icon = createFromIconfontCN({
//   scriptUrl: "iconfont.js",
// });

const navigate = (e: any, url: string = "/") => {
  /** 阻止冒泡，防止页面加载时按钮被点击然后调走 */
  e.stopPropagation();
  window.location.href = url;
};

/** 
 * 自定义阿里字体图标库组件
 * 装饰器包装一下icon组件，字体大小外部传过来，默认16
 */
const CustomIcon = (Comp: React.FC<any>) => {
  return (props: any) => (
    <Comp
      onClick={(e: any) => props.url && navigate(e, props.url)}
      // style={{ fontSize: "32px" }}
      {...props}
      className="custom-icon"
    />
  );
};
export default CustomIcon(icon);
