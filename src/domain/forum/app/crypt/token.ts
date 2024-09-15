export abstract class Token<T> {
  abstract encode(payload: Record<string, unknown>): string | Promise<string>
  abstract decode(token: string): T | Promise<T>
}
