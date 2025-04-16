import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import 'dotenv/config'; 
import {
  DynamoDBDocumentClient,
  PutCommand,
  ScanCommand,
} from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({});
const ddb = DynamoDBDocumentClient.from(client);
const tableName = process.env.FUSIONADOS_TABLE!;

export const saveFusionData = async (item: any) => {
  await ddb.send(
    new PutCommand({
      TableName: tableName,
      Item: item,
    })
  );
};

export const getFusionHistory = async (limit: number, exclusiveStartKey?: any) => {
  const result = await ddb.send(
    new ScanCommand({
      TableName: tableName,
      Limit: limit,
      ExclusiveStartKey: exclusiveStartKey,
    })
  );

  return {
    items: result.Items || [],
    lastKey: result.LastEvaluatedKey || null,
  };
};

