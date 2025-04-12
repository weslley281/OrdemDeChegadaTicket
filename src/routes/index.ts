// src/routes/index.ts
import { Router } from 'express';

const routes = Router();

routes.get('/', (req: any, res: any) => {
  return res.json({ message: 'Sistema de Atendimento por Ordem de Chegada Online 🚀' });
});

export { routes };
