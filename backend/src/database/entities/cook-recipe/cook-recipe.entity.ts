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
import CookRecipeProduct from './cook-recipe-product.entity';

@Entity()
export default class CookRecipe {
  @PrimaryGeneratedColumn()
  id: number;

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

  @ManyToOne(() => House, (house) => house.cookRecipes, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'houseId' })
  house: House;

  @OneToMany(
    () => CookRecipeProduct,
    (cookRecipeProduct) => cookRecipeProduct.cookRecipe,
    { onDelete: 'CASCADE', onUpdate: 'CASCADE' },
  )
  cookRecipeProducts: CookRecipeProduct[];
}
