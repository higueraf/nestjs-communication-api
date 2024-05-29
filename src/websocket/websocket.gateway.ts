import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, Logger } from '@nestjs/common';
import * as socketioJwt from 'socketio-jwt';
import { UserSessionService } from '../user/user-session.service';
import { websocketConfig } from './websocket-config';

@Injectable()
@WebSocketGateway(websocketConfig)
export class WebsocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(private readonly userSessionService: UserSessionService) {}

  handleConnection(client: Socket): void {
    socketioJwt.authorize({
      secret: process.env.JWT_SECRET,
      handshake: true,
      auth_header_required: true,
    })(client.handshake, (err: any) => {
      if (err) {
        Logger.error('Error during JWT authorization:', err);
        client.disconnect(true);
      } else {
        const user = this.decodedToken(client);
        const companyUserId = user.companyuserid.toUpperCase();
        Logger.log(`User Connected ${companyUserId}`);
        client.join(`companyUser:${companyUserId.toUpperCase()}`);
        client.emit('TestingEmit', { Testing: 'Emit' });
      }
    });
  }

  handleDisconnect(client: Socket): void {
    const companyUserId = this.decodedToken(client).companyuserid;
    Logger.log(`User Disconnected ${companyUserId.toUpperCase()}`);
    this.userSessionService.updateSessionEnd(companyUserId, new Date());
  }
  decodedToken(client: Socket): any {
    return (client.handshake as any).decoded_token;
  }
}
