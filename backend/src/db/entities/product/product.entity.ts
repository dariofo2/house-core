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
import ProductBatch from './product-batch.entity';
import CookRecipeProduct from '../cook-recipe/cook-recipe-product.entity';

@Entity()
export default class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  subcategoryId: number;

  @Column()
  houseId: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ nullable: true })
  unity: string | null;

  @Column({ default: 1 })
  step: number;

  @Column({ nullable: true })
  photo: string;

  @Column({ default: 1 })
  minQuantity: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => House, (house) => house.products, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'houseId' })
  house: House;

  @ManyToOne(() => Subcategory, (subcategory) => subcategory.products, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'subcategoryId' })
  subcategory: Subcategory;

  @OneToMany(() => ProductBatch, (productBatch) => productBatch.product, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  productBatches: ProductBatch[];

  @OneToMany(
    () => CookRecipeProduct,
    (cookRecipeProduct) => cookRecipeProduct.product,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  cookRecipesProduct: CookRecipeProduct[];
}
