const jestConfig = {
  preset: "ts-jest/presets/js-with-ts",
  transformIgnorePatterns: ["node_modules/(?!@getlupa/client-sdk/)"],
  moduleFileExtensions: ["js", "ts", "json", "vue"],
  modulePathIgnorePatterns: ["<rootDir>/dist/", "cypress"],
  moduleNameMapper: {
    "@/(.*)": "<rootDir>/src/$1",
  },
  transform: {
    "^.+\\.js$": "babel-jest",
    "^.+\\.vue$": "vue-jest",
  },
  testPathIgnorePatterns: ["dist", "esm", "node_modules", "cache", "cypress"],
};

if (process.env.npm_lifecycle_event === "test:unit:ci") {
  jestConfig.coverageReporters = ["text", "text-summary", "html", "cobertura"];
  jestConfig.collectCoverage = true;
  jestConfig.reporters = ["default", "jest-junit"];
}

module.exports = jestConfig;
