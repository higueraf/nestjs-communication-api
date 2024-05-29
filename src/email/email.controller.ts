import { Controller, Post, Body, Request } from '@nestjs/common';
import { EmailService } from './email.service';

@Controller('email')
export class EmailsController {
  constructor(private readonly emailService: EmailService) {}

  @Post('send')
  async sendEmail(@Request() req, @Body() emailData: any) {
    await this.emailService.sendEmail(emailData);
    return { message: 'Email sent successfully' };
  }
}
