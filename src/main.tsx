import AppIndex from "@/pages/App";
import { store } from "@/store/store";
import { App, theme } from "antd";
import zhCN from "antd/locale/zh_CN";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import dayjs from 'dayjs';

import 'dayjs/locale/zh-cn';
import "./index.css";
import { XProvider } from "@ant-design/x";

dayjs.locale('zh-cn');
ReactDOM.createRoot(document.getElementById("root")!).render(
  <XProvider
    locale={zhCN}
    theme={{
      token: {
        colorPrimary: "#FE7300",
      },
      components: {
        // // 修改单个组件的主色而不影响其他的UI组件
        // Radio: {
        //   colorPrimary: "#00b96b",
        // },
        // 滑块条颜色
        Slider: {
          railBg: "#e9e9e9",
        },
      },
      algorithm: theme.defaultAlgorithm, // 默认算法
    }}
  >
    <App>
      {/* 将store传递给所有需要用到store的组件 */}
      <Provider store={store}>
        <AppIndex />
      </Provider>
    </App>
  </XProvider>
);
