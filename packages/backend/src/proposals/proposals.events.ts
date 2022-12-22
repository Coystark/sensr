import { Proposal } from 'src/proposals/entities/proposal.entity';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EmailerService } from 'src/emailer/emailer.service';

@Injectable()
export class ProposalEvents {
  constructor(private emailerService: EmailerService) {}

  @OnEvent('proposal.created', { async: true })
  async proposalCreated(proposal: Proposal) {
    await this.emailerService.sendProposal(proposal);
  }
}
