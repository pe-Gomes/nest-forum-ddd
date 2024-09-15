import { type UseCaseError } from '@/core/errors/use-case-error'

export abstract class BaseUseCaseError extends Error implements UseCaseError {
  constructor(message: string) {
    super(message)
  }
}

export class ResourceNotFoundError extends BaseUseCaseError {
  constructor() {
    super('Resource not found.')
  }
}

export class NotAllowedError extends BaseUseCaseError {
  constructor() {
    super('Not allowed.')
  }
}
