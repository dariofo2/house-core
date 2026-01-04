import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import UserHouse from './user-house.entity';
import Event from '../event/event.entity';
import Category from '../product/category.entity';
import Product from '../product/product.entity';
import CookRecipe from '../cook-recipe/cook-recipe.entity';

@Entity()
export default class House {
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

  @OneToMany(() => UserHouse, (userHouse) => userHouse.house, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  usersHouse: UserHouse;

  @OneToMany(() => Event, (event) => event.house, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  events: Event[];

  @OneToMany(() => Category, (category) => category.house, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  categories: Category[];

  @OneToMany(() => Product, (product) => product.house, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  products: Product[];

  @OneToMany(() => CookRecipe, (cookRecipe) => cookRecipe.house, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  cookRecipes: CookRecipe[];
}
