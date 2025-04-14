import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

// Configuração do Swagger
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Usuários',
      version: '1.0.0',
      description: 'Esta é uma API de gerenciamento de usuários',
    },
    servers: [
      {
        url: 'http://localhost:3000', // Altere para o URL da sua aplicação
      },
    ],
  },
  apis: ['./src/modules/user/controllers/UserController.ts'], // Caminho para os seus controladores com as anotações do Swagger
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app: Express) => {
  // Define a rota para a documentação do Swagger
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
