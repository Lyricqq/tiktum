import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { UserModule } from './user/user.module';
import { FriendsModule } from './friends/friends.module';
import { MusicModule } from './music/music.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres', // Твой логин
      password: '25111', // Твой пароль
      database: 'tiktum_db', // Твоя база данных
      autoLoadEntities: true,
      synchronize: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'), // Указываем папку для статических файлов
      serveRoot: '/uploads', // URL для доступа к загруженным файлам
    }),
    UserModule,
    FriendsModule,
    MusicModule,
  ],
})
export class AppModule {}
