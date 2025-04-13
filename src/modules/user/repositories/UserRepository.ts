import { IUserRepository } from './IUserRepository';
import { User } from '../entities/User';
import { ICreateUserDTO } from '../dtos/ICreateUserDTO';

export class UserRepository implements IUserRepository {
  async create(data: ICreateUserDTO): Promise<User> {
    const user = await User.create(data);
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return await User.findOne({ where: { email } });
  }
}
