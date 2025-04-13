import { IUserRepository } from './IUserRepository';
import { User } from '../entities/User';
import { ICreateUserDTO } from '../dtos/ICreateUserDTO';

export class UserRepository implements IUserRepository {
  async create(data: ICreateUserDTO): Promise<User> {
    const user = await User.create(data);
    return user;
  }

  async read(): Promise<User[]> {
    return await User.findAll();
  }

  async update(data: ICreateUserDTO): Promise<User> {
    const user = await User.findByPk(data.id);

    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    await user.update(data);
    return user;
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await User.destroy({ where: { id } });
    return deleted > 0;
  }

  async find(query: string | number): Promise<User | null> {
    //se vier uma string procurar por email e se vier um number procurar por ID
    if (typeof query === 'string') {
      // procura por email
      return await User.findOne({ where: { email: query } });
    } else if (typeof query === 'number') {
      // procura por id
      return await User.findByPk(query);
    }

    return null; // fallback de segurança
  }
}
