import { Injectable } from '@nestjs/common'
import { StudentsRepository } from '../repositories/students-repository'
import { Encrypter } from '../crypt/encrypter'
import { Either, failure, success } from '@/core/either'
import { Student } from '../../enterprise/entities/student'
import { StudentAlreadyExistsError } from './errors'

export type RegisterStudentRequest = {
  name: string
  email: string
  password: string
}

type RegisterStudentResponse = Either<
  StudentAlreadyExistsError,
  { student: Student }
>

@Injectable()
export class RegisterStudentUseCase {
  constructor(
    private studentsRepository: StudentsRepository,
    private crypt: Encrypter,
  ) {}

  async execute({
    name,
    email,
    password,
  }: RegisterStudentRequest): Promise<RegisterStudentResponse> {
    const studentExists = await this.studentsRepository.getByEmail(email)

    if (studentExists) {
      return failure(new StudentAlreadyExistsError(email))
    }

    const passwordHash = await this.crypt.encrypt(password)

    const student = Student.create({ name, email, passwordHash })

    await this.studentsRepository.create(student)

    return success({ student })
  }
}
