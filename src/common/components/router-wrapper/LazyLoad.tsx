import { Spin } from "antd";
import { LazyExoticComponent, ReactNode, Suspense } from "react";
/** 路由懒加载，带Spin动画 */
const LazyLoad = (Comp: LazyExoticComponent<any>): ReactNode => {
  return (
      <Suspense
        fallback={
          <Spin
            size="large"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100vh",
            }}
          />
        }
      >
        <Comp/>
    </Suspense> 
  );
};
export default LazyLoad;