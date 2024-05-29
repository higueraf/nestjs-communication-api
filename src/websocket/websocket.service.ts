import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
@Injectable()
export class WebsocketService {
  decodedToken(client: Socket): any {
    return (client.handshake as any).decoded_token;
  }
}
