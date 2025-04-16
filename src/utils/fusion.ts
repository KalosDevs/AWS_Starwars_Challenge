interface SwapiCharacter {
  name: string;
  height: string;
  homeworld: string;
}

interface SwapiPlanet {
  name: string;
}

interface WeatherData {
  current?: {
    temperature_2m?: number;
  };
}

export const mergeData = (
  swapiData: SwapiCharacter[],
  weatherData: WeatherData,
  planetsMap: Map<string, SwapiPlanet>
) => {
  return swapiData.map((character) => {
    const homeworldUrl = character.homeworld;
    const planeta = planetsMap.get(homeworldUrl);

    return {
      nombre: character.name,
      altura: character.height,
      planeta: {
        nombre: planeta?.name ?? 'Desconocido',
        clima:
          weatherData.current?.temperature_2m !== undefined
            ? `${weatherData.current.temperature_2m} °C`
            : 'Desconocido',
      },
    };
  });
};
