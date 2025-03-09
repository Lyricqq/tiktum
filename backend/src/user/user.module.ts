import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User])], // Подключаем сущность User
  controllers: [UserController], // Контроллер
  providers: [UserService], // Сервис
  exports: [UserService, TypeOrmModule], // Экспортируем UserService и TypeOrmModule
})
export class UserModule {}
