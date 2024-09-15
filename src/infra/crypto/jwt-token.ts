import { type TokenPayload } from '../auth/jwt.strategy'
import { JwtService } from '@nestjs/jwt'
import { Token } from '@/domain/forum/app/crypt/token'
import { Injectable } from '@nestjs/common'

@Injectable()
export class JwtToken implements Token<TokenPayload> {
  constructor(private jwtService: JwtService) {}

  async encode(payload: Record<string, unknown>) {
    return await this.jwtService.signAsync(payload)
  }

  async decode(token: string) {
    return await this.jwtService.verifyAsync<TokenPayload>(token)
  }
}
