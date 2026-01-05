import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import UserRole from './user-role.entity';
import UserHouse from '../house/user-house.entity';

@Entity()
export default class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => UserRole, (userRole) => userRole.role, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  usersRole: UserRole[];

  @OneToMany(() => UserHouse, (userHouse) => userHouse.role, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  usersHouse: UserHouse[];
}
