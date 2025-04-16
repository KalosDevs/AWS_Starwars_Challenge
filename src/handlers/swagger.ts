import fs from 'fs';
import path from 'path';
import { APIGatewayProxyHandler } from 'aws-lambda';

export const handler: APIGatewayProxyHandler = async () => {
  const swaggerHtml = fs.readFileSync(path.resolve(__dirname, '../../docs/index.html'), 'utf-8');
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'text/html' },
    body: swaggerHtml,
  };
};
