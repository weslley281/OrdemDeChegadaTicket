import { Request, Response } from 'express';
import { UserRepository } from '../repositories/UserRepository';
import { CreateUserUseCase } from '../useCases/createUser/CreateUserUseCase';
import { AuthUserUseCase } from '../useCases/authUser/AuthUserUseCase';
import { z } from 'zod';

const repository = new UserRepository();
const CreateUserSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
});
const LoginUserSchema = z.object({
  email: z.string().email({ message: 'E-mail inválido' }),
  password: z.string().min(6, { message: 'A senha deve ter no mínimo 6 caracteres' }),
});

export class UserController {

  register = async (req: Request, res: Response) => {
    try {
      const validatedData = CreateUserSchema.parse(req.body);

      const createUser = new CreateUserUseCase(repository);
      const user = await createUser.execute(validatedData);

      return res.status(201).json(user);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(422).json({
          error: 'Dados inválidos',
          issues: error.errors.map((err: any) => ({
            campo: err.path[0],
            mensagem: err.message,
          })),
        });
      }

      return res.status(400).json({ error: error.message });
    }
  }

  login = async (req: Request, res: Response) => {
    try {
      const validatedData = LoginUserSchema.parse(req.body);

      const authUser = new AuthUserUseCase(repository);
      const result = await authUser.execute(validatedData);
      return res.json(result);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(422).json({
          error: 'Dados inválidos',
          issues: error.errors.map((err: any) => ({
            campo: err.path[0],
            mensagem: err.message,
          })),
        });
      }

      return res.status(401).json({ error: error.message });
    }
  }
}
