import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswersRepository } from '@/domain/forum/app/repositories/answers-repository'
import { Answer } from '@/domain/forum/enterprise/entities/answer'
import { PrismaService } from '../prisma.service'
import { PrismaAnswerMapper } from '../mappers/prisma-answer-mapper'
import { Injectable } from '@nestjs/common'
import { AnswerAttachmentsRepository } from '@/domain/forum/app/repositories/answer-attachments-repository'
import { DomainEvents } from '@/core/events/domain-events'

@Injectable()
export class PrismaAnswersRepository implements AnswersRepository {
  constructor(
    private db: PrismaService,
    private answerAttachment: AnswerAttachmentsRepository,
  ) {}

  async create(answer: Answer) {
    const data = PrismaAnswerMapper.toPersistence(answer)

    await this.db.answer.create({ data })

    await this.answerAttachment.createMany(answer.attachments.getItems())

    DomainEvents.dispatchEventsForAggregate(answer.id)
  }

  async getById(id: string) {
    const answer = await this.db.answer.findUnique({
      where: { id },
    })

    if (!answer) return null

    return PrismaAnswerMapper.toEntity(answer)
  }
  async findManyByQuestionId({
    questionId,
    page,
    limit,
  }: { questionId: string } & PaginationParams) {
    const answers = await this.db.answer.findMany({
      where: { questionId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: (page - 1) * limit,
    })

    return answers.map((answer) => PrismaAnswerMapper.toEntity(answer))
  }

  async update(answer: Answer) {
    const data = PrismaAnswerMapper.toPersistence(answer)

    //TODO: Convert promise to Transaction
    await Promise.all([
      this.db.answer.update({ where: { id: answer.id.toString() }, data }),
      this.answerAttachment.createMany(answer.attachments.getItems()),
      this.answerAttachment.deleteMany(answer.attachments.getRemovedItems()),
    ])

    DomainEvents.dispatchEventsForAggregate(answer.id)
  }
  async delete(id: string) {
    await this.db.answer.delete({ where: { id } })
  }
}
