import { Encrypter } from '@/domain/forum/app/crypt/encrypter'
import { Injectable } from '@nestjs/common'
import { compare, hash } from 'bcryptjs'

@Injectable()
export class BcryptEncrypter implements Encrypter {
  private SALT_ROUNDS = 8

  async encrypt(value: string): Promise<string> {
    return await hash(value, this.SALT_ROUNDS)
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    return await compare(plain, hash)
  }
}
