import { Module } from '@nestjs/common'
import { Encrypter } from '@/domain/forum/app/crypt/encrypter'
import { BcryptEncrypter } from './bcrypt-encrypter'
import { Token } from '@/domain/forum/app/crypt/token'
import { JwtToken } from './jwt-token'

@Module({
  providers: [
    { provide: Encrypter, useClass: BcryptEncrypter },
    { provide: Token, useClass: JwtToken },
  ],
  exports: [Encrypter, Token],
})
export class CryptoModule {}
