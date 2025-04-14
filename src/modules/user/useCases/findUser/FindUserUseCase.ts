import { IUserRepository } from '../../repositories/IUserRepository';

export class FindUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(query: string | number) {
    if (!query) {
      throw new Error('Parâmetro de busca inválido');
    }

    const user = await this.userRepository.find(query);

    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }
}
