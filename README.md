# AWS_Starwars_Challenge

# 🌌 Starwars Weather API

API construida con Serverless Framework, Node.js y TypeScript que fusiona datos del universo de Star Wars con información meteorológica. Está protegida por Cognito con el flujo `client_credentials`.

---

## 🚀 Tecnologías

- Node.js v20.16.0
- TypeScript v5.7.2
- Serverless Framework v3.40.0
- AWS Lambda
- DynamoDB
- Cognito User Pools
- OpenAPI (Swagger)
- serverless-offline
- serverless-esbuild


## 📁 Estructura del Proyecto
bash
├── src/
│   ├── handlers/
│   │   ├── fusionados.handler.ts
│   │   ├── almacenar.handler.ts
│   │   ├── historial.handler.ts
│   │   ├── swagger.handler.ts
│   │   └── swaggerYaml.handler.ts
├── docs/
│   └── swagger.yaml
├── serverless.yml
├── package.json
└── README.md
bash

📦 Instalación
bash
Copiar
Editar
npm install
🔧 Scripts útiles
bash
Copiar
Editar
# Levantar entorno local con Serverless Offline
npm run start

# Modo debug
npm run debug

# Ejecutar tests (provisorio)
npm run test
🔐 Autenticación con Cognito
El flujo de autenticación es client_credentials.

🔑 Obtener access_token:
bash
Copiar
Editar
curl --location 'https://us-east-2ymikgakss.auth.us-east-2.amazoncognito.com/oauth2/token' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--header 'Authorization: Basic <client_id:client_secret en base64>' \
--data-urlencode 'client_id=4c78faftdajd64fg4b3fg5nusc' \
--data-urlencode 'username=demopruebas' \
--data-urlencode 'password=Test1234!' \
--data-urlencode 'grant_type=client_credentials'
Reemplaza <client_id:client_secret en base64> por el resultado de codificar en base64 tu client_id:client_secret.

📘 Endpoints
Método	Ruta	Auth Requerida	Descripción
GET	/fusionados	❌	Fusiona datos de Star Wars con clima aleatorio
POST	/almacenar	✅	Almacena un planeta personalizado
GET	/historial	✅	Lista el historial de datos fusionados
GET	/docs	❌	Vista Swagger UI
GET	/docs/swagger.yaml	❌	Documento Swagger YAML
🧪 Probar en Swagger UI
Swagger UI está disponible en producción en:

🔗 https://ksfkieill2.execute-api.us-east-2.amazonaws.com/dev/docs

Para autenticar endpoints protegidos, haz lo siguiente:

Haz clic en "Authorize"

Escribe Bearer <access_token>

Ejecuta llamadas protegidas

🗃️ Tablas DynamoDB
FusionadosTable

PlanetasTable (con índice GSI NombreIndex)

ApiCache (con TTL expiresAt)

📤 Despliegue en AWS
bash
Copiar
Editar
sls deploy --stage dev
Para eliminar los recursos:

bash
Copiar
Editar
sls remove --stage dev
🧪 Testing
Por ahora, la estructura de tests está pendiente. Puedes correr pruebas básicas con:

bash
Copiar
Editar
npx jest
📌 Notas
Los endpoints /almacenar y /historial requieren autorización por Cognito.

Usamos autorización tipo COGNITO_USER_POOLS con scopes específicos para read y write.

📞 Contacto
Hecho con ❤️ para el reto de AWS.
