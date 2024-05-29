import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as ejs from 'ejs';
import * as fs from 'fs';
import * as path from 'path';
import { EmailDataDto } from './dto/email-data.dto';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  async sendEmail(emailData: EmailDataDto) {
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
      from: process.env.EMAIL_USER_DISPLAY,
    });
    const templatePath = path.resolve(
      '/root/node-nestjs-communication-api-cd/src/emails/templates',
      'emailTemplate.ejs',
    );
    const template = fs.readFileSync(templatePath, 'utf-8');
    emailData.BLOB_STORAGE_PROJECTS = process.env.BLOB_STORAGE_PROJECTS;
    emailData.COMPANY_NAME = emailData.COMPANY_NAME || 'JP GLOBAL DIGITAL';
    emailData.LOGO =
      process.env.BLOB_STORAGE_PROJECTS + '/email/logo-jp-white.png';
    const now = new Date();
    emailData.YEAR = now.getFullYear().toString();
    console.log('emailData', emailData);
    const renderedHTML = ejs.render(template, emailData);
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: emailData.RECIPIENTS,
      subject: emailData.TITLE_MESSAGE,
      html: renderedHTML,
    };
    await transporter.sendMail(mailOptions);
  }
}
