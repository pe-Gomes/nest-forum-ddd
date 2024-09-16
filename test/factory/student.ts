import { type EntityID } from '@/core/entities/value-objects/entity-id'
import {
  Student,
  type StudentProps,
} from '@/domain/forum/enterprise/entities/student'
import { FakeEncrypter } from '@tests/crypto/fake-encrypter'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'
import { PrismaStudentMapper } from '@/infra/db/prisma/mappers/prisma-student-mapper'
import { PrismaService } from '@/infra/db/prisma/prisma.service'

export async function createStudent(
  overrides: Partial<StudentProps> = {},
  id?: EntityID,
) {
  const stubEncrypt = new FakeEncrypter()

  return Student.create(
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      passwordHash: await stubEncrypt.encrypt(faker.internet.password()),
      ...overrides,
    },
    id,
  )
}

@Injectable()
export class StudentFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaStudent(data: Partial<StudentProps> = {}): Promise<Student> {
    const student = await createStudent(data)

    await this.prisma.user.create({
      data: PrismaStudentMapper.toPersistence(student),
    })

    return student
  }
}
