import { Proposal } from './entities/proposal.entity';
import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CrudRequest } from '@nestjsx/crud';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class ProposalsService extends TypeOrmCrudService<Proposal> {
  constructor(
    @InjectRepository(Proposal) repo,
    private eventEmitter: EventEmitter2,
  ) {
    super(repo);
  }

  async createOne(req: CrudRequest, dto: any) {
    const response = await super.createOne(req, dto);

    this.eventEmitter.emit('proposal.created', response);

    return response;
  }
}
