import nextPlugin from "@next/eslint-plugin-next";
import { globalIgnores } from "eslint/config";

export default [
  globalIgnores([".next/**", "out/**", "node_modules/**"]),
  {
    plugins: { "@next/next": nextPlugin },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules
    }
  }
];
