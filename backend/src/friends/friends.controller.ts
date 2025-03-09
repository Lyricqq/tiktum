import { Controller, Post, Body, Get, Param, Put, Delete } from '@nestjs/common';
import { FriendsService } from './friends.service';

@Controller('friends')
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  @Post('send-request')
  sendFriendRequest(@Body() body: { senderId: number; receiverId: number }) {
    const { senderId, receiverId } = body;
    return this.friendsService.sendFriendRequest(senderId, receiverId);
  }

  @Get('pending/:userId')
  getPendingRequests(@Param('userId') userId: number) {
    return this.friendsService.getPendingRequests(userId);
  }

  @Put('handle-request/:requestId')
  handleFriendRequest(
    @Param('requestId') requestId: number,
    @Body() body: { accept: boolean },
  ) {
    return this.friendsService.handleFriendRequest(requestId, body.accept);
  }

  @Get(':userId')
  getFriends(@Param('userId') userId: number) {
    return this.friendsService.getFriends(userId);
  }

  @Delete('remove')
  removeFriend(@Body() body: { userId: number; friendId: number }) {
    const { userId, friendId } = body;
    return this.friendsService.removeFriend(userId, friendId);
  }
}
