import { ICreateUserDTO } from '../dtos/ICreateUserDTO';
import { User } from '../entities/User';

export interface IUserRepository {
  create(data: ICreateUserDTO): Promise<User>;
  read(): Promise<User[]>;
  update(data: ICreateUserDTO): Promise<User>;
  delete(query: string | number): Promise<Boolean>;
  find(query: string | number): Promise<User | null>;
}
