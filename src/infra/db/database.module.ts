import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { QuestionsRepository } from '@/domain/forum/app/repositories/questions-repository'
import { PrismaQuestionsRepository } from './prisma/repositories/questions-repository'
import { StudentsRepository } from '@/domain/forum/app/repositories/students-repository'
import { PrismaStudentsRepository } from './prisma/repositories/students-repository'
import { QuestionCommentsRepository } from '@/domain/forum/app/repositories/question-comments-repository'
import { PrismaQuestionCommentsRepository } from './prisma/repositories/question-comments-repository'
import { QuestionAttachmentsRepository } from '@/domain/forum/app/repositories/question-attachments-repository'
import { PrismaQuestionAttachmentsRepository } from './prisma/repositories/question-attachments-repository'
import { AnswersRepository } from '@/domain/forum/app/repositories/answers-repository'
import { PrismaAnswersRepository } from './prisma/repositories/answers-repository'
import { PrismaAnswerCommentsRepository } from './prisma/repositories/answer-comments-repository'
import { AnswerCommentsRepository } from '@/domain/forum/app/repositories/answer-comments-repository'
import { AnswerAttachmentsRepository } from '@/domain/forum/app/repositories/answer-attachments-repository'
import { PrismaAnswerAttachmentsRepository } from './prisma/repositories/answer-attachments-repository'
import { AttachmentsRepository } from '@/domain/forum/app/repositories/attachments-repository'
import { PrismaAttachmentsRepository } from './prisma/repositories/attachments-repository'

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
    {
      provide: QuestionCommentsRepository,
      useClass: PrismaQuestionCommentsRepository,
    },
    {
      provide: QuestionAttachmentsRepository,
      useClass: PrismaQuestionAttachmentsRepository,
    },
    {
      provide: AnswersRepository,
      useClass: PrismaAnswersRepository,
    },
    {
      provide: AnswerCommentsRepository,
      useClass: PrismaAnswerCommentsRepository,
    },
    {
      provide: AnswerAttachmentsRepository,
      useClass: PrismaAnswerAttachmentsRepository,
    },
    {
      provide: AttachmentsRepository,
      useClass: PrismaAttachmentsRepository,
    },
  ],
  exports: [
    PrismaService,
    QuestionsRepository,
    StudentsRepository,
    QuestionCommentsRepository,
    QuestionAttachmentsRepository,
    AnswersRepository,
    AnswerCommentsRepository,
    AnswerAttachmentsRepository,
    AttachmentsRepository,
  ],
})
export class DatabaseModule {}
