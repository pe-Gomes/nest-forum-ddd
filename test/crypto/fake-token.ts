import { type Token } from '@/domain/forum/app/crypt/token'

type FakeTokenPayload = {
  sub: string
}

export class FakeToken implements Token {
  async encode(payload: FakeTokenPayload): Promise<string> {
    return JSON.stringify(payload)
  }

  async decode<FakeTokenPayload>(token: string) {
    return JSON.parse(token) as FakeTokenPayload
  }
}
