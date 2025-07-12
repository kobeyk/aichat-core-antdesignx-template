import react from "@vitejs/plugin-react";
import path from "path"; // 消除node错误提示，需要安装 npm i -D @types/node
import { visualizer } from "rollup-plugin-visualizer"; //查看生成stats打包视图
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  base: "./" /** 解决打包发布资源404问题 */,
  plugins: [
    react({}),
    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  resolve: {
    // 配置别名
    alias: {
      "@": path.resolve(__dirname, "src"),
      "core-web-model": path.resolve(__dirname, "src/typing"),
    },
    //导入时想要忽略的扩展名列表
    extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
  },
  css: {
    modules: {
      generateScopedName: "[name]__[local]___[hash:base64:5]",
      hashPrefix: "prefix",
    },
    preprocessorOptions: {
      less: {
        // 由于antd5摒弃了less，完全采用了css in js，所以网上的配置这个达到修改antd ui主色的是走不通的
      },
      scss: {
        silenceDeprecations: ["legacy-js-api"],
      },
    },
  },
  server: {
    // 服务端口
    port: 3066,
    // 主机 解决vite use--host to expose
    host: "0.0.0.0",
    // 自动打开浏览器,由于每次启动都会弹出，所以这个可以适当的关闭
    open: false,
    cors: true,
    // https: false,
    // 代理跨域（mock 不需要配置，这里只是个事列）
    proxy: {
      "/mcp": {
        target: "http://127.0.0.1:8000/mcp", // easymock
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/mcp/, ""),
      },
    },
  },
  build: {
    outDir: "dist",
    minify: "esbuild",
    rollupOptions: {
      output: {
        /**将文件分门别类，js，css这些资源目录分别打包到对应的文件夹 */
        chunkFileNames: "assets/js/[name]-[hash].js",
        entryFileNames: "assets/js/[name]-[hash].js",
        assetFileNames: "assets/[ext]/[name]-[hash].[ext]",
      },
    },
    chunkSizeWarningLimit: 1500,
  },
});
