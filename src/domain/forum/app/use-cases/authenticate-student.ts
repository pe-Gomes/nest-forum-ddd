import { Injectable } from '@nestjs/common'
import { StudentsRepository } from '../repositories/students-repository'
import { Encrypter } from '../crypt/encrypter'
import { Either, failure, success } from '@/core/either'
import { Token } from '../crypt/token'
import { BadCredentialsError } from './errors'

export type AuthenticateStudentRequest = {
  email: string
  password: string
}

type AccessToken = { accessToken: string }

type AuthenticateStudentResponse = Either<BadCredentialsError, AccessToken>

@Injectable()
export class AuthenticateStudentUseCase {
  constructor(
    private studentsRepository: StudentsRepository,
    private crypt: Encrypter,
    private token: Token,
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateStudentRequest): Promise<AuthenticateStudentResponse> {
    const student = await this.studentsRepository.getByEmail(email)

    if (!student) {
      return failure(new BadCredentialsError())
    }

    const isPasswordCorrect = await this.crypt.compare(
      password,
      student.passwordHash,
    )

    if (!isPasswordCorrect) {
      return failure(new BadCredentialsError())
    }

    const accessToken = await this.token.encode({ sub: student.id.toString() })

    return success({ accessToken })
  }
}
