import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

const client = new DynamoDBClient({ region: 'us-east-2' });
const dynamoDb = DynamoDBDocumentClient.from(client);

const PlanetaSchema = z.object({
  nombre: z.string().min(1, { message: "El nombre es requerido" }).trim(),
  masaKg: z.string().min(1, { message: "La masa es requerida" })
    .refine(val => !isNaN(Number(val)) && Number(val) > 0, {
      message: "La masa debe ser un número positivo"
    }),
  radioKm: z.string().min(1, { message: "El radio es requerido" })
    .refine(val => !isNaN(Number(val)) && Number(val) > 0, {
      message: "El radio debe ser un número positivo"
    }),
  distanciaSolKm: z.string().min(1, { message: "La distancia es requerida" })
    .refine(val => !isNaN(Number(val)) && Number(val) > 0, {
      message: "La distancia debe ser un número positivo"
    }),
  poseeAnillos: z.boolean().default(false),
  numeroLunas: z.number().int().nonnegative({ message: "El número de lunas debe ser un entero positivo" }).default(0),
  atmosfera: z.array(
    z.string().min(1, { message: "Los componentes atmosféricos no pueden estar vacíos" })
  ).default([]),
  gravedad: z.string().min(1, { message: "La gravedad es requerida" })
    .refine(val => !isNaN(Number(val)) && Number(val) > 0, {
      message: "La gravedad debe ser un número positivo"
    })
});

type Planeta = {
  id: string;
  nombre: string;
  masaKg: string;
  radioKm: string;
  distanciaSolKm: string;
  poseeAnillos: boolean;
  numeroLunas: number;
  atmosfera: string[];
  gravedad: string;
};

export const handler: APIGatewayProxyHandler = async (event) => {
  if (!event.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({ 
        error: 'Bad Request',
        message: 'El cuerpo de la solicitud está vacío' 
      }),
    };
  }

  try {
    const rawBody = JSON.parse(event.body);
    const validationResult = PlanetaSchema.safeParse(rawBody);

    if (!validationResult.success) {
      const errorDetails = validationResult.error.issues.map(issue => ({
        field: issue.path.join('.'),
        message: issue.message,
        received: issue.code
      }));

      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'Validación fallida',
          details: errorDetails
        }),
      };
    }

    // 1. Primero verificamos si el planeta ya existe
    const nombrePlaneta = validationResult.data.nombre;
    const queryResult = await dynamoDb.send(new QueryCommand({
      TableName: process.env.PLANETAS_TABLE || 'PlanetasTable',
      IndexName: 'NombreIndex',
      KeyConditionExpression: 'nombre = :nombre',
      ExpressionAttributeValues: {
        ':nombre': validationResult.data.nombre
      },
      Limit: 1
    }));

    if (queryResult.Items && queryResult.Items.length > 0) {
      return {
        statusCode: 409,
        body: JSON.stringify({
          error: 'Conflict',
          message: 'Ya existe un planeta con este nombre'
        })
      };
    }

    // 2. Si no existe, procedemos a crear
    const planeta: Planeta = {
      id: uuidv4(),
      nombre: nombrePlaneta,
      masaKg: validationResult.data.masaKg,
      radioKm: validationResult.data.radioKm,
      distanciaSolKm: validationResult.data.distanciaSolKm,
      poseeAnillos: validationResult.data.poseeAnillos,
      numeroLunas: validationResult.data.numeroLunas,
      atmosfera: validationResult.data.atmosfera,
      gravedad: validationResult.data.gravedad
    };

    await dynamoDb.send(new PutCommand({
      TableName: process.env.PLANETAS_TABLE || 'PlanetasTable',
      Item: planeta
    }));

    const responseData = {
      ...planeta,
      masaKg: Number(planeta.masaKg),
      radioKm: Number(planeta.radioKm),
      distanciaSolKm: Number(planeta.distanciaSolKm),
      gravedad: Number(planeta.gravedad)
    };

    return {
      statusCode: 201,
      headers: {
        'Content-Type': 'application/json',
        'Location': `${process.env.API_GATEWAY_URL}/planetas/${planeta.id}`
      },
      body: JSON.stringify({
        message: 'Planeta guardado exitosamente',
        data: responseData
      }),
    };

  } catch (error) {
    console.error('Error general:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Internal Server Error',
        message: 'Ocurrió un error inesperado',
        details: error instanceof Error ? error.message : 'Error desconocido'
      }),
    };
  }
};