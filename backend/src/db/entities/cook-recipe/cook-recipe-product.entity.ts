import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import CookRecipe from './cook-recipe.entity';
import Product from '../product/product.entity';

@Entity()
export default class CookRecipeProduct {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  cookRecipeId: number;

  @Column()
  productId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => CookRecipe, (cookRecipe) => cookRecipe.cookRecipeProducts, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  cookRecipe: CookRecipe;

  @ManyToOne(() => Product, (product) => product.cookRecipesProduct, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  product: Product;
}
