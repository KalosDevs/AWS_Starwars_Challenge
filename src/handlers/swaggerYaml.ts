import { APIGatewayProxyHandler } from "aws-lambda";
import path from "path";
import * as fs from 'fs';

const serverUrl = process.env.API_GATEWAY_URL || 'http://localhost:3000';

export const handler: APIGatewayProxyHandler = async () => {
    let yaml = fs.readFileSync(path.resolve(__dirname, '../../docs/swagger.yaml'), 'utf-8');

    yaml = yaml.replace('{serverUrl}', serverUrl);
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'text/yaml' },
      body: yaml,
    };
  };
  