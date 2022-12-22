import { User } from 'src/users/entities/user.entity';
import { Customer } from './../../customers/entities/customer.entity';
import { Product } from './../../products/entities/product.entity';
import { BaseModel } from 'src/core/models/base.model';
import { Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne } from 'typeorm';

@Entity()
export class Proposal extends BaseModel {
  @ManyToMany(() => Product)
  @JoinTable()
  products: Product[];

  @ManyToOne(() => Customer, (customer) => customer.proposals, {
    eager: true,
  })
  @JoinColumn()
  customer: Customer;

  @ManyToOne(() => User, (user) => user.proposals, {
    eager: true,
  })
  @JoinColumn()
  user: User;
}
