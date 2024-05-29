import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class NotificationService {
  constructor(private readonly httpService: HttpService) {}

  async send(data: any): Promise<void> {
    // const url = 'http://localhost:3001/notification';
    // await this.httpService.post(url, data);
    console.log(data);
  }
}
