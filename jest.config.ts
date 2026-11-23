import type { Config } from "jest";

const config: Config = {
  // Usa ts-jest para transformar TypeScript
  preset: "ts-jest",
  testEnvironment: "node",

  // Alias de módulos (@/ → src raíz del proyecto)
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },

  // FIX MANTENIMIENTO QA-02: incluir ambas carpetas, también tests/crm/clientes.test.ts.
  testMatch: [
    "**/__tests__/**/*.test.ts",
    "**/__tests__/**/*.test.tsx",
    "**/tests/**/*.test.ts",
    "**/tests/**/*.test.tsx",
  ],

  // Ignora la carpeta de Next.js y node_modules
  testPathIgnorePatterns: ["/node_modules/", "/.next/"],

  // Configura ts-jest para usar el tsconfig del proyecto
  transform: {
    "^.+\\.(ts|tsx)$": ["ts-jest", { tsconfig: "tsconfig.json" }],
  },
};

export default config;
