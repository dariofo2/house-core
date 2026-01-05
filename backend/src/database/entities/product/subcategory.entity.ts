import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import Product from './product.entity';
import Category from './category.entity';

@Entity()
export default class Subcategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  categoryId: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Product, (product) => product.subcategory, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  products: Product[];

  @ManyToOne(() => Category, (category) => category.subcategories, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  category: Category;
}
