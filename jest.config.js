/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': ['ts-jest'],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  testMatch: ['**/tests/**/*.test.ts', '**/tests/**/*.test.tsx'],
  globals: {
    'ts-jest': {
      isolatedModules: true,
    },
  },
  // Nueva configuración para manejar módulos ES
  moduleNameMapper: {
    '^@aws-sdk/client-dynamodb$': '<rootDir>/node_modules/@aws-sdk/client-dynamodb/dist-cjs/index.js',
    '^@aws-sdk/lib-dynamodb$': '<rootDir>/node_modules/@aws-sdk/lib-dynamodb/dist-cjs/index.js'
  },
  transformIgnorePatterns: [
    'node_modules/(?!@aws-sdk/)' // Asegura que los módulos de AWS SDK se transformen
  ]
};