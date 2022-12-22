import { Proposal } from './../../proposals/entities/proposal.entity';
import { BaseModel } from 'src/core/models/base.model';
import { Entity, Column, OneToMany } from 'typeorm';

@Entity()
export class Customer extends BaseModel {
  @Column()
  name: string;

  @Column()
  email: string;

  @OneToMany(() => Proposal, (proposal) => proposal.customer)
  proposals: Proposal[];
}
