import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { MusicService } from './music.service';
import { MusicController } from './music.controller';
import { Track } from './music.entity';
import { UserModule } from '../user/user.module'; // Подключение UserModule

@Module({
  imports: [
    TypeOrmModule.forFeature([Track]), // Подключаем сущность Track
    UserModule, // Подключаем UserModule для доступа к UserRepository
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'), // Папка для статических файлов
      serveRoot: '/uploads', // URL для отдачи файлов
    }),
  ],
  providers: [MusicService], // Сервис для работы с треками
  controllers: [MusicController], // Контроллер для работы с API
})
export class MusicModule {}
