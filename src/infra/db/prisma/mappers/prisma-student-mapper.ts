import { EntityID } from '@/core/entities/value-objects/entity-id'
import { Student } from '@/domain/forum/enterprise/entities/student'
import { type User } from '@prisma/client'

export class PrismaStudentMapper {
  static toEntity(student: User) {
    return Student.create(
      {
        name: student.name,
        email: student.email,
        passwordHash: student.passwordHash,
      },
      new EntityID(student.id),
    )
  }

  static toPersistence(student: Student): User {
    return {
      id: student.id.toString(),
      name: student.name,
      email: student.email,
      passwordHash: student.passwordHash,
      role: 'STUDENT',
    }
  }
}
