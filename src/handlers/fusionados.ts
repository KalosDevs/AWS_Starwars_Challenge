import AWS from 'aws-sdk';
import axios from 'axios';
import { getStarWarsData } from '../services/swapi';
import { getWeatherData } from '../services/weather';
import { mergeData } from '../utils/fusion';
import { getFromCache, saveToCache, deleteFromCache } from '../services/cache';
import { saveFusionData } from '../services/db';
import { v4 as uuidv4 } from 'uuid';

export const handler = async () => {
  const cacheKey = 'fusionados';
  try {
    console.info(`[Inicio de función fusionados]`);

    // Verificar si existe un valor en caché
    const cached = await getFromCache(cacheKey);
    if (cached) {
      console.info(`[CACHE HIT]`);
      return {
        statusCode: 200,
        body: JSON.stringify(cached),
      };
    }

    console.info(`[CACHE MISS] Consultando APIs externas`);

    // Ejecutar las llamadas a las APIs de manera paralela
    const [swapiData, weatherData] = await Promise.all([getStarWarsData(), getWeatherData()]);

    // Asegurar que los datos de swapiData sean válidos
    if (!Array.isArray(swapiData)) {
      throw new Error('Los datos de StarWars no son un array');
    }

    // Obtener los planetas de las URLs de homeworld
    const homeworldUrls = [...new Set(swapiData.map((char) => char.homeworld))];
    const planetResponses = await Promise.all(
      homeworldUrls.map((url) => axios.get(url))
    );

    const planetsMap = new Map<string, { name: string }>();
    planetResponses.forEach((res, i) =>
      planetsMap.set(homeworldUrls[i], res.data)
    );

    // Fusionar los datos
    const merged = mergeData(swapiData, weatherData, planetsMap);

    // Guardar los datos fusionados
    const fusionRecord = {
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      data: merged,
    };

    await saveFusionData(fusionRecord);
    await deleteFromCache(`historial_limit_10_next_undefined`);
    await saveToCache(cacheKey, merged);

    return {
      statusCode: 200,
      body: JSON.stringify(merged),
    };
  } catch (error) {
    console.error(`[ERROR]`, error);
    
    // Retornar un mensaje de error al cliente
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error interno del servidor' }),
    };
  }
};
