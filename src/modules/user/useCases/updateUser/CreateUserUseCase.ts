import { ICreateUserDTO } from '../../dtos/ICreateUserDTO';
import { IUserRepository } from '../../repositories/IUserRepository';
import bcrypt from 'bcryptjs';

export class UpdateUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(data: ICreateUserDTO) {
    if (!data.id) {
      throw new Error('ID do usuário é obrigatório para atualização');
    }

    const userExists = await this.userRepository.find(data.id);

    if (!userExists) {
      throw new Error('Usuário não encontrado');
    }

    let updatedData = { ...data };

    // Se a senha for enviada, fazer o hash
    if (data.password) {
      updatedData.password = await bcrypt.hash(data.password, 10);
    }

    const updatedUser = await this.userRepository.update(updatedData);

    return {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
    };
  }
}
