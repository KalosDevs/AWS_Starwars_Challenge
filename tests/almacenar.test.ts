const mockSend = jest.fn();
const mockFrom = jest.fn(() => ({
  send: mockSend,
}));

// 2. Mockear antes de importar cualquier módulo que los use
jest.mock('@aws-sdk/lib-dynamodb', () => {
  const original = jest.requireActual('@aws-sdk/lib-dynamodb');
  return {
    ...original,
    DynamoDBDocumentClient: {
      from: mockFrom
    },
    QueryCommand: jest.fn().mockImplementation((params) => params),
    PutCommand: jest.fn().mockImplementation((params) => params),
  };
});

jest.mock('@aws-sdk/client-dynamodb', () => ({
  DynamoDBClient: jest.fn()
}));

jest.mock('uuid', () => ({
  v4: () => 'mocked-uuid',
}));

// 3. Ahora sí, importar el handler (después de los mocks)
import { handler } from '../src/handlers/almacenar';
import { createMockEvent } from './mocks/mockEvent';
import { APIGatewayProxyResult } from 'aws-lambda';

describe('almacenar handler', () => {
  beforeEach(() => {
    mockSend.mockClear();
    mockFrom.mockClear();
    jest.clearAllMocks();
  });

  test('almacenar planeta exitosamente', async () => {
    mockSend
      .mockImplementationOnce(() => Promise.resolve({ Items: [] })) // Query
      .mockImplementationOnce(() => Promise.resolve({})); // Put

    const mockBody = {
      nombre: 'Júpiter',
      masaKg: '1.9e27',
      radioKm: '69911',
      distanciaSolKm: '778500000',
      poseeAnillos: true,
      numeroLunas: 79,
      atmosfera: ['hidrógeno', 'helio'],
      gravedad: '24.79',
    };

    const event = createMockEvent(mockBody);
    const response = await handler(event, {} as any, () => {}) as APIGatewayProxyResult;

    expect(response.statusCode).toBe(201);
    const responseBody = JSON.parse(response.body);
    expect(responseBody.data.nombre).toBe('Júpiter');
    expect(responseBody.data.id).toBe('mocked-uuid');
  });

  test('debe fallar si el planeta ya existe', async () => {
    mockSend.mockImplementationOnce(() =>
      Promise.resolve({
        Items: [{ nombre: 'Júpiter' }]
      })
    );

    const mockBody = {
      nombre: 'Júpiter',
      masaKg: '1.9e27',
      radioKm: '69911',
      distanciaSolKm: '778500000',
      poseeAnillos: true,
      numeroLunas: 79,
      atmosfera: ['hidrógeno', 'helio'],
      gravedad: '24.79',
    };

    const event = createMockEvent(mockBody);
    const response = await handler(event, {} as any, () => {}) as APIGatewayProxyResult;

    expect(response.statusCode).toBe(409);
    const responseBody = JSON.parse(response.body);
    expect(responseBody.error).toBe('Conflict');
  });

});