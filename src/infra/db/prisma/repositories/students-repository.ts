import { type StudentsRepository } from '@/domain/forum/app/repositories/students-repository'
import { type Student } from '@/domain/forum/enterprise/entities/student'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaStudentsRepository implements StudentsRepository {
  constructor(private db: PrismaService) {}

  getByEmail(email: string): Promise<Student | null> {
    throw new Error('Method not implemented.')
  }
  getById(id: string): Promise<Student | null> {
    throw new Error('Method not implemented.')
  }
  create(student: Student): Promise<Student> {
    throw new Error('Method not implemented.')
  }
}
