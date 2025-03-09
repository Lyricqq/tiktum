import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(username: string, password: string): Promise<User> {
    const newUser = this.userRepository.create({ username, password });
    return await this.userRepository.save(newUser);
  }

  async findByUsername(username: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { username } });
  }

  async updateDefaultSection(userId: number, defaultSection: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('Пользователь не найден');
    }
    user.defaultSection = defaultSection;
    return await this.userRepository.save(user);
  }
}
