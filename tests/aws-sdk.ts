// __mocks__/aws-sdk.ts

export const DynamoDB = {
    DocumentClient: jest.fn(() => ({
      put: jest.fn().mockReturnThis(),
      promise: jest.fn().mockResolvedValue({}),
    })),
  };
  