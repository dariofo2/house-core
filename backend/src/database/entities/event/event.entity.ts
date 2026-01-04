import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import House from '../house/house.entity';

@Entity()
export default class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  houseId: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  maxDays: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => House, (house) => house.events, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'houseId' })
  house: House;
}
