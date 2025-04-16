import axios from "axios";

export interface SwapiCharacter {
  name: string;
  height: string;
  homeworld: string;
}

export const getStarWarsData = async (): Promise<SwapiCharacter[]> => {
  try {
    const response = await axios.get('https://sw.simplr.sh/api/people/all.json');
    
    // Aquí verificamos directamente la respuesta
    if (Array.isArray(response.data)) {
      return response.data; // Devolver la respuesta directamente si es un array
    } else {
      console.error('Error: Los datos de StarWars no son un array. Estructura inesperada.');
      return []; // Devuelve un array vacío si no es un array
    }
  } catch (error) {
    console.error('Error al obtener datos de SWAPI:', error);
    return []; // Devuelve un array vacío en caso de error
  }
};
