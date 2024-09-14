import { compare, hash } from 'bcryptjs'

const HASH_SALT = 6

export async function hashPassword(password: string) {
  return await hash(password, HASH_SALT)
}

export async function comparePassword(password: string, hash: string) {
  return await compare(password, hash)
}
