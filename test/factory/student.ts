import { type EntityID } from '@/core/entities/value-objects/entity-id'
import {
  Student,
  type StudentProps,
} from '@/domain/forum/enterprise/entities/student'
import { FakeEncrypter } from '@tests/crypto/fake-encrypter'
import { faker } from '@faker-js/faker'

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
