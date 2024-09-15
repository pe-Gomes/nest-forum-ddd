import { type Token } from '@/domain/forum/app/crypt/token'
import { type JwtService } from '@nestjs/jwt'
import { type TokenPayload } from '../auth/jwt.strategy'

export class JwtToken implements Token<TokenPayload> {
  constructor(private readonly jwtService: JwtService) {}

  async encode(payload: Record<string, unknown>) {
    return await this.jwtService.signAsync(payload)
  }

  async decode(token: string) {
    return await this.jwtService.verifyAsync<TokenPayload>(token)
  }
}
