import { 
    Controller, 
    Post, 
    UploadedFile, 
    UseInterceptors, 
    Body, 
    Get, 
    Query, 
    Param, 
    BadRequestException, 
    InternalServerErrorException 
  } from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { MusicService } from './music.service';
  
  @Controller('music')
  export class MusicController {
    constructor(private readonly musicService: MusicService) {}
  
    @Post('upload-file')
    @UseInterceptors(
      FileInterceptor('file', {
        dest: './uploads', // Папка для сохранения файлов
      }),
    )
    async uploadFile(
      @UploadedFile() file: Express.Multer.File,
      @Body() body: { ownerId: number; title: string; artist: string },
    ) {
      try {
        console.log('Файл загружен:', file);
        console.log('Тело запроса:', body);
  
        // Проверка на наличие обязательных данных
        if (!file) {
          throw new BadRequestException('Файл не загружен');
        }
        if (!body.ownerId || !body.title || !body.artist) {
          throw new BadRequestException('Отсутствуют обязательные данные');
        }
  
        const { ownerId, title, artist } = body;
        const fileUrl = `/uploads/${file.filename}`; // Формируем URL для загруженного файла
  
        // Вызываем сервис для сохранения трека
        return await this.musicService.uploadTrack(ownerId, title, artist, fileUrl);
      } catch (error) {
        console.error('Ошибка при загрузке трека:', error.message);
        throw new InternalServerErrorException(
          'Произошла ошибка при загрузке трека',
        );
      }
    }
  
    @Get(':ownerId')
    async getUserTracks(@Param('ownerId') ownerId: number) {
      try {
        console.log(`Получение треков для пользователя с ID: ${ownerId}`);
        return await this.musicService.getTracks(ownerId);
      } catch (error) {
        console.error('Ошибка при получении треков:', error.message);
        throw new InternalServerErrorException(
          'Не удалось получить список треков',
        );
      }
    }
  
    @Get('search')
    async searchTracks(@Query('query') query: string) {
      try {
        console.log(`Поиск треков с запросом: "${query}"`);
        return await this.musicService.searchTracks(query);
      } catch (error) {
        console.error('Ошибка при поиске треков:', error.message);
        throw new InternalServerErrorException('Не удалось выполнить поиск');
      }
    }
  }
  