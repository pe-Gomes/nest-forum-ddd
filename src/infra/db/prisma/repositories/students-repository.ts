import { type StudentsRepository } from '@/domain/forum/app/repositories/students-repository'
import { type Student } from '@/domain/forum/enterprise/entities/student'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaStudentMapper } from '../mappers/prisma-student-mapper'

@Injectable()
export class PrismaStudentsRepository implements StudentsRepository {
  constructor(private db: PrismaService) {}

  async getByEmail(email: string) {
    const student = await this.db.user.findFirst({
      where: {
        email,
      },
    })

    if (!student) return null

    return PrismaStudentMapper.toEntity(student)
  }

  async getById(id: string) {
    const student = await this.db.user.findFirst({
      where: {
        id,
      },
    })

    if (!student) return null

    return PrismaStudentMapper.toEntity(student)
  }
  async create(student: Student) {
    const data = PrismaStudentMapper.create(student)

    await this.db.user.create({ data })
  }
}
