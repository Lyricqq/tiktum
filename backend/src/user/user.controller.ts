import { Controller, Post, Body, BadRequestException, Put } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('auth')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() body: { username: string; password: string }) {
    const { username, password } = body;
    const existingUser = await this.userService.findByUsername(username);

    if (existingUser) {
      throw new BadRequestException('Пользователь с таким логином уже существует');
    }

    const user = await this.userService.createUser(username, password);
    return { message: 'Регистрация успешна', user };
  }

  @Post('login')
  async login(@Body() body: { username: string; password: string }) {
    const { username, password } = body;
    const user = await this.userService.findByUsername(username);

    if (!user || user.password !== password) {
      throw new BadRequestException('Неправильный логин или пароль');
    }

    return { 
      message: 'Авторизация успешна', 
      userId: user.id, 
      defaultSection: user.defaultSection 
    };
  }

  @Put('update-default-section')
  async updateDefaultSection(
    @Body() body: { userId: number; defaultSection: string },
  ) {
    const { userId, defaultSection } = body;
    const user = await this.userService.updateDefaultSection(userId, defaultSection);
    return { message: 'Страница по умолчанию обновлена', user };
  }
}
