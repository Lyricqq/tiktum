import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { User } from '../user/user.entity';

@Entity('friend_requests')
export class FriendRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  senderId: number;

  @Column()
  receiverId: number;

  @Column({ default: 'pending' })
  status: 'pending' | 'accepted' | 'rejected';
}

@Entity('friends')
export class Friend {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany(() => User)
  @JoinTable()
  users: User[];
}
