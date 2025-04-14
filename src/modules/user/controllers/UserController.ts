import { Request, Response } from 'express';
import { z } from 'zod';
import { UserRepository } from '../repositories/UserRepository';
import { CreateUserUseCase } from '../useCases/createUser/CreateUserUseCase';
import { AuthUserUseCase } from '../useCases/authUser/AuthUserUseCase';
import { ReadUsersUseCase } from '../useCases/readUsers/ReadUsersUseCase';
import { FindUserUseCase } from '../useCases/findUser/FindUserUseCase';
import { UpdateUserUseCase } from '../useCases/updateUser/CreateUserUseCase';
import { DeleteUserUseCase } from '../useCases/deleteUser/DeleteUserUseCase';


/**
 * @swagger
 * /register:
 *   post:
 *     summary: Cria um novo usuário
 *     description: Cria um usuário com nome, e-mail e senha
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nome do usuário
 *               email:
 *                 type: string
 *                 description: E-mail do usuário
 *               password:
 *                 type: string
 *                 description: Senha do usuário
 *             required:
 *               - name
 *               - email
 *               - password
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *       422:
 *         description: Dados inválidos
 *       400:
 *         description: Erro ao processar requisição
 *       500:
 *         description: Erro no servidor
 * 
 * /login:
 *   post:
 *     summary: Realiza o login do usuário
 *     description: Realiza a autenticação do usuário com email e senha
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: E-mail do usuário
 *               password:
 *                 type: string
 *                 description: Senha do usuário
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Login bem-sucedido
 *       422:
 *         description: Dados inválidos
 *       401:
 *         description: E-mail ou senha incorretos
 * 
 * /update/{id}:
 *   put:
 *     summary: Atualiza os dados do usuário
 *     description: Atualiza as informações de um usuário específico pelo ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do usuário a ser atualizado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nome do usuário
 *               email:
 *                 type: string
 *                 description: E-mail do usuário
 *               password:
 *                 type: string
 *                 description: Senha do usuário
 *             required:
 *               - name
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso
 *       422:
 *         description: Dados inválidos
 *       404:
 *         description: Usuário não encontrado
 * 
 * /users:
 *   get:
 *     summary: Retorna todos os usuários
 *     description: Obtém uma lista de todos os usuários cadastrados
 *     responses:
 *       200:
 *         description: Lista de usuários
 *       500:
 *         description: Erro no servidor
 * 
 * /user/{query}:
 *   get:
 *     summary: Encontra um usuário pelo ID ou E-mail
 *     description: Busca um usuário com base no ID ou no E-mail fornecido
 *     parameters:
 *       - in: path
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *         description: ID ou E-mail do usuário
 *     responses:
 *       200:
 *         description: Usuário encontrado
 *       404:
 *         description: Usuário não encontrado
 *       422:
 *         description: Parâmetro inválido
 * 
 * /delete/{id}:
 *   delete:
 *     summary: Deleta um usuário
 *     description: Exclui um usuário com base no ID fornecido
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do usuário a ser deletado
 *     responses:
 *       200:
 *         description: Usuário deletado com sucesso
 *       404:
 *         description: Usuário não encontrado
 *       400:
 *         description: ID inválido
 *       500:
 *         description: Erro no servidor
 */

const repository = new UserRepository();

const CreateUserSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
});

const UpdateUserSchema = z.object({
  id: z.number(),
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
});

const LoginUserSchema = z.object({
  email: z.string().email({ message: 'E-mail inválido' }),
  password: z.string().min(6, { message: 'A senha deve ter no mínimo 6 caracteres' }),
});

const FindUserSchema = z.union([
  z.string().email('E-mail inválido'),
  z.string().regex(/^\d+$/, 'ID deve ser um número').transform(Number),
]);

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

  update = async (req: Request, res: Response) => {
    try {
      const validatedData = UpdateUserSchema.parse({
        ...req.body,
        id: Number(req.params.id),
      });

      const updateUser = new UpdateUserUseCase(repository);
      const user = await updateUser.execute(validatedData);
      return res.json(user);
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
  };

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

  read = async (_req: Request, res: Response) => {
    try {
      const readUsers = new ReadUsersUseCase(repository);
      const users = await readUsers.execute();

      return res.json(users);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  find = async (req: Request, res: Response) => {
    try {
      const queryParam = req.params.query;
      const parsedQuery = FindUserSchema.parse(queryParam);

      const findUser = new FindUserUseCase(repository);
      const user = await findUser.execute(parsedQuery);

      return res.json(user);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(422).json({
          error: 'Parâmetro inválido',
          issues: error.errors.map((err: any) => ({
            campo: err.path[0],
            mensagem: err.message,
          })),
        });
      }

      return res.status(404).json({ error: error.message });
    }
  }

  delete = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({ error: 'ID inválido' });
      }

      const deleteUser = new DeleteUserUseCase(repository);
      const success = await deleteUser.execute(id);

      if (!success) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      return res.status(200).json({ message: 'Usuário deletado com sucesso' });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  };
}
