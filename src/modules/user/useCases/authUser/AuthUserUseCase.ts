import { IUserRepository } from '../../repositories/IUserRepository';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../../entities/User';

interface IRequest {
  email: string;
  password: string;
}

export class AuthUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute({ email, password }: IRequest) {
    const user = await this.userRepository.findByEmail(email);

    if (!user) throw new Error('E-mail ou senha inválidos');

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) throw new Error('E-mail ou senha inválidos');

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'secret123',
      { expiresIn: '1d' }
    );

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }
}
