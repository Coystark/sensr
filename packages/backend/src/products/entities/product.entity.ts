import { BaseModel } from 'src/core/models/base.model';
import { AfterLoad, Column, Entity } from 'typeorm';

@Entity()
export class Product extends BaseModel {
  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ type: 'bigint' })
  price: number;

  @AfterLoad() _convertNumerics() {
    this.price = parseFloat(this.price as any);
  }
}
