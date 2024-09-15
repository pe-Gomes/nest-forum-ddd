export abstract class Encrypter {
  abstract encrypt(value: string): Promise<string>
  abstract compare(plain: string, hash: string): Promise<boolean>
}
