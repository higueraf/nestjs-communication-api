import { Injectable } from '@nestjs/common';
import { WebsocketGateway } from './websocket.gateway';
import { EmitDataDto } from './dto/emit-data.dto';

@Injectable()
export class CommonWebsocketService {
  constructor(private readonly wsGateway: WebsocketGateway) {}
  async Emit(emitDataDto: EmitDataDto) {
    for (const recipient of emitDataDto.Recipients) {
      console.log('recipient', recipient);
      this.wsGateway.server
        .to(`companyUser:${recipient.toUpperCase()}`)
        .emit('New Notification', {
          Title: emitDataDto.Title,
          Message: emitDataDto.Message,
          Icon: emitDataDto.Message,
        });
    }
  }
}
