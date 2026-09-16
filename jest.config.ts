import type { Config } from "jest";

const config: Config = {
  // Usa ts-jest para transformar TypeScript
  preset: "ts-jest",
  testEnvironment: "node",

  // Alias de módulos (@/ → src raíz del proyecto)
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },

  // Rutas de tests
  testMatch: ["**/__tests__/**/*.test.ts", "**/__tests__/**/*.test.tsx"],

  // Ignora la carpeta de Next.js y node_modules
  testPathIgnorePatterns: ["/node_modules/", "/.next/"],

  // Configura ts-jest para usar el tsconfig del proyecto
  transform: {
    "^.+\\.(ts|tsx)$": ["ts-jest", { tsconfig: "tsconfig.json" }],
  },
};

export default config;
