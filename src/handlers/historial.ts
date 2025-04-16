import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { getFusionHistory } from '../services/db';
import { getFromCache, saveToCache } from '../services/cache';

export const handler: APIGatewayProxyHandler = async (event): Promise<APIGatewayProxyResult> => {
  try {
    const queryParams = event.queryStringParameters || {};
    const limit = parseInt(queryParams.limit || '10', 10);
    const nextKey = queryParams.nextKey ? JSON.parse(decodeURIComponent(queryParams.nextKey)) : undefined;

    const cacheKey = `historial_limit_${limit}_next_${JSON.stringify(nextKey)}`;

    const cached = await getFromCache(cacheKey); 
    if (cached) {
      return {
        statusCode: 200,
        body: JSON.stringify(cached),
      };
    }

    const { items, lastKey } = await getFusionHistory(limit, nextKey);

    const ordenado = items.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    const response = {
      historial: ordenado,
      nextKey: lastKey ? encodeURIComponent(JSON.stringify(lastKey)) : null,
    };

    await saveToCache(cacheKey, response);

    return {
      statusCode: 200,
      body: JSON.stringify(response),
    };
  } catch (error) {
    console.error('Error al obtener historial:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Error al obtener historial',
        detalle: (error as Error).message,
      }),
    };
  }
};

