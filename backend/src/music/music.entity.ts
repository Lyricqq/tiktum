import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../user/user.entity';

@Entity('tracks')
export class Track {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  artist: string;

  @Column()
  url: string; // Ссылка на загруженный трек

  @ManyToOne(() => User, (user) => user.id)
  owner: User;
}
