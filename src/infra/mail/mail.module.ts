import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
// import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import environment from '@/configs/environment';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: environment.MAIL_HOST,
        port: environment.MAIL_PORT,
        auth: {
          user: environment.MAIL_USER,
          pass: environment.MAIL_PASS,
        },
      },
      defaults: {
        from: '"nest-modules" <modules@nestjs.com>',
      },
      // template: {
      //   dir: __dirname + 'templates',
      //   adapter: new HandlebarsAdapter(),
      //   options: {
      //     strict: true,
      //   },
      // },
    }),
  ],
})
export class MailModule {}
