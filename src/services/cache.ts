import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import { DeleteCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({});
const ddb = DynamoDBDocumentClient.from(client);
const cacheTable = process.env.CACHE_TABLE!;
const TTL_SECONDS = Number(process.env.CACHE_TTL_MINUTES || 30) * 60;

export const getFromCache = async (key: string) => {
  const result = await ddb.send(
    new GetCommand({
      TableName: cacheTable,
      Key: { cacheKey: key },
    })
  );

  const item = result.Item;
  if (!item || !item.expiresAt || Date.now() / 1000 > item.expiresAt) {
    return null;
  }

  return item.data;
};

export const saveToCache = async (key: string, data: any) => {
  const now = Math.floor(Date.now() / 1000);
  const expiresAt = now + TTL_SECONDS;

  await ddb.send(
    new PutCommand({
      TableName: cacheTable,
      Item: {
        cacheKey: key,
        data,
        createdAt: now,
        expiresAt,
      },
    })
  );
};

export const deleteFromCache = async (key: string) => {
  const now = Math.floor(Date.now() / 1000);
  await ddb.send(
    new DeleteCommand({
      TableName: cacheTable,
      Key: { cacheKey: key },
    })
  );
};


