import { IUserRepository } from '../../repositories/IUserRepository';

export class ReadUsersUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute() {
    const users = await this.userRepository.read();

    return users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
    }));
  }
}
