/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom',
  testMatch: ['**/__tests__/**/*.test.{ts,tsx}'],
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(png|jpg|jpeg|gif|svg)$': '<rootDir>/src/__mocks__/fileMock.cjs',
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: 'tsconfig.test.json' }],
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/main.tsx',
    '!src/mocks/**',
    '!src/**/*.d.ts',
    '!src/setupTests.ts',
    '!src/__mocks__/**',
    '!src/types/index.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
}
