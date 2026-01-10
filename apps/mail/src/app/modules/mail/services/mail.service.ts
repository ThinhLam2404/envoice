import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer from 'nodemailer';
import type { SendMailOptions } from '@common/interfaces/common';
@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(MailService.name);
  constructor(private config: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.config.get<string>('MAIL_CONFIG.HOST'),
      port: this.config.get<number>('MAIL_CONFIG.PORT'),
      secure: false,
      auth: {
        user: this.config.get<string>('MAIL_CONFIG.USER'),
        pass: this.config.get<string>('MAIL_CONFIG.PASS'),
      },
    });
  }

  async sendMail({ to, subject, text, html, senderEmail, senderName, attachments }: SendMailOptions) {
    const defaultName = this.config.get<string>('MAIL_CONFIG.SENDER_NAME');
    const defaultEmail = this.config.get<string>('MAIL_CONFIG.SENDER_EMAIL');

    const mailOptions = {
      from: `${senderName ?? defaultName} <${senderEmail ?? defaultEmail}>`,
      to,
      subject,
      text: text ?? html.replace(/<[^>]+>/g, ''),
      html,
      attachments,
    };
    try {
      const info = await this.transporter.sendMail(mailOptions);

      this.logger.log(`Email sent: ${info.messageId} to ${to}`);
    } catch (error) {
      this.logger.error('Error sending email:', error);
    }
  }
}
