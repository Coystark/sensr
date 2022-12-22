import { MailerOptions, MailerOptionsFactory } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import * as path from 'path';

@Injectable()
export class MailerOptionsClass implements MailerOptionsFactory {
  constructor(private configService: ConfigService) {}

  createMailerOptions(): MailerOptions {
    const payload = {
      transport: {
        host: this.configService.get('TRANSACTIONAL_HOST'),
        secure:
          this.configService.get('TRANSACTIONAL_SECURE') === 'true' || false,
        auth: {
          user: this.configService.get('TRANSACTIONAL_USER'),
          pass: this.configService.get('TRANSACTIONAL_PASSWORD'),
        },
        port: Number(this.configService.get('TRANSACTIONAL_PORT')) || 587,
        service: this.configService.get('TRANSACTIONAL_SERVICE'),
        debug: true,
      },
      template: {
        dir: path.resolve(__dirname, 'templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          extName: '.hbs',
          layoutsDir: path.resolve(__dirname, 'templates'),
        },
      },
      defaults: {
        from: this.configService.get('TRANSACTIONAL_EMAIL'),
        replyTo: this.configService.get('TRANSACTIONAL_EMAIL'),
      },
    };
    return payload;
  }
}
