import express from 'express';
import cors from 'cors';
import { routes } from './routes';
import helmet from 'helmet';

const app = express();

// Configuração padrão segura
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"], // permite scripts inline
      styleSrc: ["'self'", "'unsafe-inline'"], // se estiver usando CSS inline
    },
  })
);


app.use(cors());
app.use(express.json());

app.use('/api', routes);

export { app };
