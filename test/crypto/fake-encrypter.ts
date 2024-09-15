import { type Encrypter } from '@/domain/forum/app/crypt/encrypter'

export class FakeEncrypter implements Encrypter {
  async encrypt(value: string): Promise<string> {
    return value.concat('-hashed')
  }
  async compare(plain: string, hash: string): Promise<boolean> {
    return plain.concat('-hashed') === hash
  }
}
