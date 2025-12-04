module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/__tests__/**/*.test.ts'],
    moduleFileExtensions: ['ts', 'js', 'json', 'node'],
    roots: ['<rootDir>/src'],
    transformIgnorePatterns: [
        "node_modules/(?!(@langchain|@pinecone-database|p-retry|uuid|@browserbasehq|firebase-admin|@firebase)/)"
    ],
};
