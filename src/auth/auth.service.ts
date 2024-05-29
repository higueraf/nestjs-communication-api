import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private decodeToken(token: string): any {
    const jwtService = new JwtService();
    return jwtService.decode(token);
  }
}
