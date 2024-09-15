export abstract class Token {
  abstract encode(payload: Record<string, unknown>): string | Promise<string>
  abstract decode<T>(token: string): T | Promise<T>
}
