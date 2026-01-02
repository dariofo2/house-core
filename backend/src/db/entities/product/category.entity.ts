import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import House from '../house/house.entity';
import Subcategory from './subcategory.entity';

@Entity()
export default class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  houseId: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => House, (house) => house.categories, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'houseId' })
  house: House;

  @OneToMany(() => Subcategory, (subcategory) => subcategory.category, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  subcategories: Subcategory[];
}
