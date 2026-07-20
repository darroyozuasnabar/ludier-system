import { defineConfig, globalIgnores } from "eslint/config";
import next from "eslint-config-next/core-web-vitals.js";
import ts from "eslint-config-next/typescript.js";

const eslintConfig = defineConfig([
  next,
  ts,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;