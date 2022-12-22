import { Exclude } from 'class-transformer';
import { BaseModel } from 'src/core/models/base.model';
import { Proposal } from 'src/proposals/entities/proposal.entity';
import { Entity, Column, OneToMany } from 'typeorm';

@Entity()
export class User extends BaseModel {
  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Exclude()
  @Column()
  passwordHash: string;

  @OneToMany(() => Proposal, (proposal) => proposal.user)
  proposals: Proposal[];

  constructor(partial?: Partial<User>) {
    super();
    Object.assign(this, partial);
  }
}
