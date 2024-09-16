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

export class InvalidAttachmentTypeError extends BaseUseCaseError {
  constructor(type: string) {
    super(`File type ${type} is not valid.`)
  }
}
