import { BaseUseCaseError } from '@/core/errors'

export class StudentAlreadyExistsError extends BaseUseCaseError {
  constructor(identifier: string) {
    super(`Student with "${identifier}" already exists.`)
  }
}

export class BadCredentialsError extends BaseUseCaseError {
  constructor() {
    super('Bad credentials.')
  }
}
