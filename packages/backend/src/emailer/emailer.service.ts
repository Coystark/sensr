import { Proposal } from 'src/proposals/entities/proposal.entity';
import { MailerService, ISendMailOptions } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailerService {
  constructor(private mailerService: MailerService) {}

  async sendProposal(proposal: Proposal) {
    const mail: ISendMailOptions = {
      to: proposal.customer.email,
      subject: 'Proposta',
      template: 'proposal',
      context: {
        products: proposal.products.map((product) => ({
          ...product,
          price: new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }).format(product.price / 100),
        })),
      },
    };

    return this.mailerService.sendMail(mail);
  }
}
