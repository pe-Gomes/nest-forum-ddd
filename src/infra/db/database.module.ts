import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { QuestionsRepository } from '@/domain/forum/app/repositories/questions-repository'
import { PrismaQuestionsRepository } from './prisma/repositories/questions-repository'

@Module({
  providers: [
    PrismaService,
    {
      provide: QuestionsRepository,
      useClass: PrismaQuestionsRepository,
    },
  ],
  exports: [PrismaService, QuestionsRepository],
})
export class DatabaseModule {}
