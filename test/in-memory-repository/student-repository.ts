import { type StudentsRepository } from '@/domain/forum/app/repositories/students-repository'
import { type Student } from '@/domain/forum/enterprise/entities/student'

export class InMemoryStudentsRepository implements StudentsRepository {
  public students: Student[] = []

  async getByEmail(email: string): Promise<Student | null> {
    return this.students.find((student) => student.email === email) ?? null
  }

  async getById(id: string) {
    return this.students.find((student) => student.id.toString() === id) ?? null
  }

  async create(student: Student): Promise<void> {
    this.students.push(student)
  }
}
