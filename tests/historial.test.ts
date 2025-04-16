import { handler } from '../src/handlers/historial';
import { getFusionHistory } from '../src/services/db';
import { getFromCache, saveToCache } from '../src/services/cache';

jest.mock('../src/services/db', () => ({
    getFusionHistory: jest.fn(),
}));

jest.mock('../src/services/cache', () => ({
    getFromCache: jest.fn(),
    saveToCache: jest.fn(),
}));

it('debería retornar los datos desde la caché si existen', async () => {
    const mockCacheData = {
      historial: [{
        id: 'e3a8e2a6-4958-4111-bc73-116d7e90a7e6',
        data: [],
        timestamp: '2025-04-14T07:40:44.746Z'
      }],
      nextKey: null,
    };
  
    (getFromCache as jest.Mock).mockResolvedValue(mockCacheData);
  
    const event = { queryStringParameters: { limit: '10', offset: '0' } };
  
    const result = await handler(event as any, {} as any, {} as any);
  
    expect(result).toEqual({
      statusCode: 200,
      body: JSON.stringify(mockCacheData),
    });
  });
  


