import express from 'express';
import cors from 'cors';
import { routes } from './routes';
import helmet from 'helmet';
import { userRoutes } from './routes/user.routes';
import { sequelize } from './config/sequelize';

const app = express();

// Segurança com Helmet
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
    },
  })
);

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas
app.use('/api', routes);
app.use('/users', userRoutes); // <-- suas rotas estão aqui

// Inicialização do servidor
async function main() {
  try {
    await sequelize.sync(); // garante que os models estão sincronizados
    app.listen(3333, () => console.log('Servidor de banco de dados online 🚀'));
  } catch (error) {
    console.error('Erro ao iniciar o servidor:', error);
  }
}

main();

export { app };
