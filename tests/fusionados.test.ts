import { handler } from '../src/handlers/fusionados'; // ajusta ruta según tu estructura
import { deleteFromCache } from '../src/services/cache';
import { saveFusionData } from '../src/services/db';

jest.mock('../src/services/swapi', () => ({
    getStarWarsData: jest.fn().mockResolvedValue([
        { name: 'Luke Skywalker', homeworld: 'https://swapi.dev/api/planets/1/' },
    ]),
}));

jest.mock('../src/services/weather', () => ({
    getWeatherData: jest.fn().mockResolvedValue({
        current: { temperature_2m: 25 },
    }),
}));


jest.mock('axios', () => ({
    get: jest.fn().mockResolvedValue({ data: { name: 'Tatooine' } }),
}));

jest.mock('../src/services/db', () => ({
    saveFusionData: jest.fn(),
}));

jest.mock('../src/services/cache', () => ({
    getFromCache: jest.fn().mockResolvedValue(null),
    saveToCache: jest.fn(),
    deleteFromCache: jest.fn().mockResolvedValue(undefined),
}));


test('deleteFromCache should be called', async () => {
    const key = 'test-key';
    await deleteFromCache(key);
    expect(deleteFromCache).toHaveBeenCalledWith(key);
});

const mockedSaveFusionData = saveFusionData as jest.MockedFunction<typeof saveFusionData>;

it('debería llamar a saveFusionData con datos válidos', async () => {
    await handler();

    expect(mockedSaveFusionData).toHaveBeenCalled();

    const item = mockedSaveFusionData.mock.calls[0][0];
    expect(item).toHaveProperty('id');
    expect(item).toHaveProperty('timestamp');
    expect(Array.isArray(item.data)).toBe(true);
    expect(item.data[0]).toHaveProperty('nombre', 'Luke Skywalker');
    expect(item.data[0].planeta).toHaveProperty('nombre', 'Tatooine');
    expect(item.data[0].planeta).toHaveProperty('clima', '25 °C');
});

describe('handler fusionados', () => {
    it('debería fusionar datos correctamente y devolver 200', async () => {
        const response = await handler();
        const body = JSON.parse(response.body);

        expect(response.statusCode).toBe(200);
        expect(body).toBeDefined();
        expect(Array.isArray(body)).toBe(true);
        expect(body[0].nombre).toBe('Luke Skywalker');
        expect(body[0].planeta.nombre).toBe('Tatooine');
        expect(body[0].planeta.clima).toBe('25 °C');
    });
});

