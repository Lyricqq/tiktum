import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FriendRequest, Friend } from './friends.entity';
import { User } from '../user/user.entity';

@Injectable()
export class FriendsService {
  constructor(
    @InjectRepository(FriendRequest)
    private readonly friendRequestRepository: Repository<FriendRequest>,
    @InjectRepository(Friend)
    private readonly friendRepository: Repository<Friend>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async sendFriendRequest(senderId: number, receiverId: number) {
    const existingRequest = await this.friendRequestRepository.findOne({
      where: { senderId, receiverId },
    });

    if (existingRequest) {
      throw new Error('Заявка уже отправлена');
    }

    const friendRequest = this.friendRequestRepository.create({ senderId, receiverId });
    return this.friendRequestRepository.save(friendRequest);
  }

  async getPendingRequests(userId: number) {
    return this.friendRequestRepository.find({
      where: { receiverId: userId, status: 'pending' },
    });
  }

  async handleFriendRequest(requestId: number, accept: boolean) {
    const request = await this.friendRequestRepository.findOne({ where: { id: requestId } });
    if (!request) {
      throw new Error('Заявка не найдена');
    }

    if (accept) {
      const friendship = this.friendRepository.create();
      friendship.users = await this.userRepository.findByIds([request.senderId, request.receiverId]);
      await this.friendRepository.save(friendship);
      request.status = 'accepted';
    } else {
      request.status = 'rejected';
    }

    return this.friendRequestRepository.save(request);
  }

  async getFriends(userId: number) {
    const friendships = await this.friendRepository.find({ relations: ['users'] });
    return friendships
      .filter((friendship) => friendship.users.some((user) => user.id === userId))
      .map((friendship) =>
        friendship.users.filter((user) => user.id !== userId),
      );
  }

  async removeFriend(userId: number, friendId: number) {
    const friendships = await this.friendRepository.find({ relations: ['users'] });
    const friendship = friendships.find((f) =>
      f.users.some((user) => user.id === userId) &&
      f.users.some((user) => user.id === friendId),
    );

    if (!friendship) {
      throw new Error('Дружба не найдена');
    }

    await this.friendRepository.remove(friendship);
  }
}
