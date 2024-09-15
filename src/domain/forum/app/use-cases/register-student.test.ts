import { InMemoryStudentsRepository } from '@tests/in-memory-repository/student-repository'
import { RegisterStudentUseCase } from './register-student'
import { FakeEncrypter } from '@tests/crypto/fake-encrypter'
import { createStudent } from '@tests/factory/student'
import { StudentAlreadyExistsError } from './errors'

let studentsRepository: InMemoryStudentsRepository
let cryptStub: FakeEncrypter
let sut: RegisterStudentUseCase

describe('Register Student Use Case', () => {
  beforeEach(() => {
    studentsRepository = new InMemoryStudentsRepository()
    cryptStub = new FakeEncrypter()
    sut = new RegisterStudentUseCase(studentsRepository, cryptStub)
  })

  it('should register a student', async () => {
    await sut.execute({
      name: 'test',
      email: 'test@email.com',
      password: 'password',
    })

    expect(studentsRepository.students.length).toBe(1)
    expect(studentsRepository.students[0].id.toString()).toBeTruthy()
  })

  it('should return a student already exists error', async () => {
    const student = await createStudent()

    await studentsRepository.create(student)

    const response = await sut.execute({
      name: 'random name',
      email: student.email,
      password: 'password',
    })

    expect(response.isFailure()).toBeTruthy()
    expect(response.value).toBeInstanceOf(StudentAlreadyExistsError)
  })
})
