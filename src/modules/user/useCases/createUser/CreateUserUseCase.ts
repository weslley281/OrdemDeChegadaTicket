import { ICreateUserDTO } from '../../dtos/ICreateUserDTO';
import { IUserRepository } from '../../repositories/IUserRepository';
import bcrypt from 'bcryptjs';

export class CreateUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(data: ICreateUserDTO) {
    const userEmailExists = await this.userRepository.find(data.email);

    if (userEmailExists) {
      throw new Error('Email de Usuário já cadastrado');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await this.userRepository.create({
      ...data,
      password: hashedPassword,
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }
}
