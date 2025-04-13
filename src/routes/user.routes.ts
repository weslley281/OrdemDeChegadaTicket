import { Router, Request, Response, NextFunction } from 'express';
import { UserController } from '../modules/user/controllers/UserController';

const userRoutes = Router();
const controller = new UserController();

const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction) =>
            Promise.resolve(fn(req, res, next)).catch(next);
  
userRoutes.get(
  '/register',
  asyncHandler(async (req: Request, res: Response) => {
    return res.json({ sucesso: 'Deu certo' });
  })
);

userRoutes.post(
  '/register',
  asyncHandler(controller.register)
);

export { userRoutes };
