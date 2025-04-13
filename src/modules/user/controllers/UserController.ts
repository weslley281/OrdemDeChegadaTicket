import { Request, Response } from 'express';
import { UserRepository } from '../repositories/UserRepository';
import { CreateUserUseCase } from '../useCases/createUser/CreateUserUseCase';
import { AuthUserUseCase } from '../useCases/authUser/AuthUserUseCase';

const repository = new UserRepository();

export class UserController {

  register = async (req: Request, res: Response) => {
    try {
      const createUser = new CreateUserUseCase(repository);
      const user = await createUser.execute(req.body);
      return res.status(201).json(user);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  login = async (req: Request, res: Response) => {
    try {
      const authUser = new AuthUserUseCase(repository);
      const result = await authUser.execute(req.body);
      return res.json(result);
    } catch (error: any) {
      return res.status(401).json({ error: error.message });
    }
  }
}
