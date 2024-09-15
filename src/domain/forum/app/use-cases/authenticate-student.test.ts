import { FakeEncrypter } from '@tests/crypto/fake-encrypter'
import { AuthenticateStudentUseCase } from './authenticate-student'
import { InMemoryStudentsRepository } from '@tests/in-memory-repository/student-repository'
import { FakeToken } from '@tests/crypto/fake-token'
import { createStudent } from '@tests/factory/student'
import { BadCredentialsError } from './errors'

let studentsRepository: InMemoryStudentsRepository
let encrypter: FakeEncrypter
let tokenStub: FakeToken
let sut: AuthenticateStudentUseCase

describe('AuthenticateStudent Use Case', () => {
  beforeEach(() => {
    encrypter = new FakeEncrypter()
    tokenStub = new FakeToken()
    studentsRepository = new InMemoryStudentsRepository()
    sut = new AuthenticateStudentUseCase(
      studentsRepository,
      encrypter,
      tokenStub,
    )
  })

  it('should return an access token on success', async () => {
    const student = await createStudent({
      passwordHash: await encrypter.encrypt('password'),
    })

    await studentsRepository.create(student)

    const response = await sut.execute({
      email: student.email,
      password: 'password',
    })

    expect(response.isSuccess()).toBe(true)
    expect(response.value).toEqual({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      accessToken: expect.any(String),
    })
  })

  it('should return a BadCredentialsError if the password is wrong', async () => {
    const student = await createStudent()

    await studentsRepository.create(student)

    const res = await sut.execute({
      email: student.email,
      password: 'wrong-pass',
    })

    expect(res.isFailure()).toBe(true)
    expect(res.value).toBeInstanceOf(BadCredentialsError)
  })

  it('should return a BadCredentialsError if the student does not exist', async () => {
    const res = await sut.execute({
      email: 'invalid_email',
      password: 'password',
    })

    expect(res.isFailure()).toBe(true)
    expect(res.value).toBeInstanceOf(BadCredentialsError)
  })
})
