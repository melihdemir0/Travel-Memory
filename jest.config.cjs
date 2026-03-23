module.exports = {
  testEnvironment: "jsdom",
  roots: ["<rootDir>/src/tests"],
  clearMocks: true,
  transform: {},
  moduleFileExtensions: ["js", "jsx", "json"],
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
  collectCoverageFrom: [
    "src/context/**/*.js",
    "src/hooks/**/*.js",
    "src/interfaces/**/*.js",
    "src/utils/**/*.js",
    "!src/tests/**",
  ],
  coverageReporters: ["text", "text-summary"],
};
