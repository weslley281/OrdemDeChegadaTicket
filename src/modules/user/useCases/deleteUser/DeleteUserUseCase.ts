import { IUserRepository } from '../../repositories/IUserRepository';

export class DeleteUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(id: number) {
    if (!id) {
      throw new Error('ID do usuário é obrigatório para exclusão');
    }

    const userExists = await this.userRepository.find(id);

    if (!userExists) {
      throw new Error('Usuário não encontrado');
    }

    const deleted = await this.userRepository.delete(id);

    if (!deleted) {
      throw new Error('Erro ao deletar o usuário');
    }

    return { message: 'Usuário deletado com sucesso' };
  }
}
