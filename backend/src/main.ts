import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Включаем CORS
  app.enableCors({
    origin: 'http://localhost', // Разрешаем запросы с фронтенда Next.js (порт 80)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Разрешенные методы
    credentials: true, // Разрешаем куки и авторизацию, если нужно
  });

  // Слушаем на порту 4000
  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
