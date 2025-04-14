import { Router, Request, Response, NextFunction } from 'express';
import { UserController } from '../modules/user/controllers/UserController';

const userRoutes = Router();
const controller = new UserController();

const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);

// Teste de rota
userRoutes.get('/register', asyncHandler(async (req: Request, res: Response) => {
  return res.json({ sucesso: 'Deu certo' });
}));

// Cadastro de usuário
userRoutes.post('/register', asyncHandler(controller.register));

// Login de usuário
userRoutes.post('/login', asyncHandler(controller.login));

// Listar todos os usuários
userRoutes.get('/users', asyncHandler(controller.read));

// Buscar um usuário por ID ou e-mail
userRoutes.get('/users/:query', asyncHandler(controller.find));

// Atualizar um usuário
userRoutes.put('/users/:id', asyncHandler(controller.update));

// Deletar um usuário
userRoutes.delete('/users/:id', asyncHandler(controller.delete));

export { userRoutes };
