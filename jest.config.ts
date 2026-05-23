import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  testMatch: ["**/__tests__/**/*.test.ts"],
  clearMocks: true,
  coverageProvider: "v8",
  collectCoverageFrom: [
    "src/lib/admin-auth.ts",
    "src/lib/session.ts",
    "src/lib/validation.ts",
  ],
};

export default config;
