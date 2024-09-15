import { type PaginationParams } from '@/core/repositories/pagination-params'
import { type AnswersRepository } from '@/domain/forum/app/repositories/answers-repository'
import { type Answer } from '@/domain/forum/enterprise/entities/answer'
import { type PrismaService } from '../prisma.service'
import { PrismaAnswerMapper } from '../mappers/prisma-answer-mapper'

export class PrismaAnswersRepository implements AnswersRepository {
  constructor(private db: PrismaService) {}

  async create(answer: Answer) {
    const data = PrismaAnswerMapper.toPersistence(answer)

    await this.db.answer.create({ data })
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

    await this.db.answer.update({ where: { id: answer.id.toString() }, data })
  }
  async delete(id: string) {
    await this.db.answer.delete({ where: { id } })
  }
}
