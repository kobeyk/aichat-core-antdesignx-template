module.exports = {
  env: { browser: true, es2020: true },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: { ecmaVersion: "latest", sourceType: "module" },
  plugins: ["react-refresh"],
  rules: {
    "react-refresh/only-export-components": "warn",
    eqeqeq: 2, // 强制使用 === 和 !==
    "no-console": "off",
    "no-debugger": "off",
    "no-irregular-whitespace": "off", //这禁止掉 空格报错检查
    "no-unused-vars": "off", // 如果有定义过但未使用的变量打包不报错
  },
};
