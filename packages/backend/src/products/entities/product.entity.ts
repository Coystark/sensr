import { BaseModel } from 'src/core/models/base.model';
import { AfterLoad, Column, Entity } from 'typeorm';

@Entity()
export class Product extends BaseModel {
  @Column()
  name: string;

  @Column()
  description: string;

  @Column({
    type: 'bigint',
    transformer: {
      to: (value) => Math.round(value),
      from: (value) => value,
    },
  })
  price: number;

  @AfterLoad() _convertNumerics() {
    this.price = parseFloat(this.price as any);
  }
}
