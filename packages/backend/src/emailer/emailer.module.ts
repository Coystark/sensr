import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmailerService } from './emailer.service';
import { MailerOptionsClass } from './emailer.config';

@Module({
  imports: [
    ConfigModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useClass: MailerOptionsClass,
      inject: [ConfigService],
    }),
  ],
  providers: [EmailerService],
  exports: [EmailerService],
})
export class EmailerModule {}
