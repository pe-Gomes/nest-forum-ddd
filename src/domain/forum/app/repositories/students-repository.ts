import { type Student } from '../../enterprise/entities/student'

export abstract class StudentsRepository {
  abstract getByEmail(email: string): Promise<Student | null>
  abstract getById(id: string): Promise<Student | null>
  abstract create(student: Student): Promise<Student>
}
