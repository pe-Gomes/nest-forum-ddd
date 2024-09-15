import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { QuestionsRepository } from '@/domain/forum/app/repositories/questions-repository'
import { PrismaQuestionsRepository } from './prisma/repositories/questions-repository'
import { StudentsRepository } from '@/domain/forum/app/repositories/students-repository'
import { PrismaStudentsRepository } from './prisma/repositories/students-repository'

@Module({
  providers: [
    PrismaService,
    {
      provide: QuestionsRepository,
      useClass: PrismaQuestionsRepository,
    },
    {
      provide: StudentsRepository,
      useClass: PrismaStudentsRepository,
    },
  ],
  exports: [PrismaService, QuestionsRepository, StudentsRepository],
})
export class DatabaseModule {}
