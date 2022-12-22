import { Proposal } from './entities/proposal.entity';
import { Controller, Request } from '@nestjs/common';
import { ProposalsService } from './proposals.service';
import {
  Crud,
  CrudController,
  CrudRequest,
  Override,
  ParsedBody,
  ParsedRequest,
} from '@nestjsx/crud';

@Crud({
  validation: false,
  model: {
    type: Proposal,
  },
  params: {
    id: {
      field: 'id',
      primary: true,
      type: 'string',
    },
  },
  query: {
    join: {
      customer: {
        eager: true,
      },
      products: {
        eager: true,
      },
      user: {
        eager: true,
      },
    },
  },
})
@Controller('proposals')
export class ProposalsController implements CrudController<Proposal> {
  constructor(public service: ProposalsService) {}

  get base(): CrudController<Proposal> {
    return this;
  }

  @Override()
  createOne(
    @Request() originalRequest,
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: any,
  ) {
    return this.base.createOneBase(req, {
      ...dto,
      user: { id: originalRequest.user.id },
    });
  }
}
