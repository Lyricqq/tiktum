import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Track } from './music.entity';
import { User } from '../user/user.entity';

@Injectable()
export class MusicService {
  constructor(
    @InjectRepository(Track)
    private readonly trackRepository: Repository<Track>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>, // Репозиторий пользователей
  ) {}

  // Загрузка нового трека
  async uploadTrack(ownerId: number, title: string, artist: string, url: string) {
    // Проверяем, существует ли пользователь
    const owner = await this.userRepository.findOne({ where: { id: ownerId } });
    if (!owner) {
      throw new NotFoundException('Пользователь с таким ID не найден');
    }

    // Создаем и сохраняем новый трек
    const track = this.trackRepository.create({ owner, title, artist, url });
    return await this.trackRepository.save(track);
  }

  // Получение всех треков конкретного пользователя
  async getTracks(ownerId: number) {
    return await this.trackRepository.find({
      where: { owner: { id: ownerId } },
      relations: ['owner'], // Подгружаем информацию о владельце
    });
  }

  // Поиск треков по названию или исполнителю
  async searchTracks(query: string) {
    return await this.trackRepository
      .createQueryBuilder('track')
      .where('track.title ILIKE :query OR track.artist ILIKE :query', { query: `%${query}%` })
      .getMany();
  }
}
