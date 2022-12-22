import { EmailerModule } from './../emailer/emailer.module';
import { Proposal } from 'src/proposals/entities/proposal.entity';
import { Module } from '@nestjs/common';
import { ProposalsService } from './proposals.service';
import { ProposalsController } from './proposals.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProposalEvents } from './proposals.events';

@Module({
  imports: [TypeOrmModule.forFeature([Proposal]), EmailerModule],
  controllers: [ProposalsController],
  providers: [ProposalsService, ProposalEvents],
})
export class ProposalsModule {}
