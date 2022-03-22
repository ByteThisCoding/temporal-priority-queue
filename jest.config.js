module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    modulePathIgnorePatterns: ["./dist/", "./coverage", "public-api.ts"],
    collectCoverage: true,
    collectCoverageFrom: ["**/*.ts", "!**/*.mock.ts"],
};
