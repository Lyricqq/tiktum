import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendRequest, Friend } from './friends.entity';
import { FriendsService } from './friends.service';
import { FriendsController } from './friends.controller';
import { User } from '../user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FriendRequest, Friend, User])],
  providers: [FriendsService],
  controllers: [FriendsController],
})
export class FriendsModule {}
