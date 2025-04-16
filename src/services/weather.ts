import axios from 'axios';

const getRandomCoordinate = (min: number, max: number) => {
  return (Math.random() * (max - min) + min).toFixed(2);
};

export const getWeatherData = async () => {
  const latitude = getRandomCoordinate(-90, 90);
  const longitude = getRandomCoordinate(-180, 180);

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m`;

  try {
    const response = await axios.get(url);
    return {
      ...response.data,
      latitude,
      longitude,
    };
  } catch (error) {
    console.error('Error al obtener datos del clima:', error);
    return {
      current: {
        temperature_2m: 'Desconocido',
      },
      latitude,
      longitude,
    };
  }
};
