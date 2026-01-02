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
export default class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column()
  email: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => UserRole, (userRole) => userRole.user, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  userRoles: UserRole[];

  @OneToMany(() => UserHouse, (userHouse) => userHouse.user, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  userHouses: UserHouse[];
}
