import { type PaginationParams } from '@/core/repositories/pagination-params'
import { type QuestionsRepository } from '@/domain/forum/app/repositories/questions-repository'
import { Question } from '@/domain/forum/enterprise/entities/question'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaQuestionMapper } from '../mappers/prisma-question-mapper'

@Injectable()
export class PrismaQuestionsRepository implements QuestionsRepository {
  constructor(private readonly db: PrismaService) {}

  async create(question: Question) {
    const prismaQuestion = PrismaQuestionMapper.create(question)

    await this.db.question.create({ data: prismaQuestion })
  }

  async getBySlug(slug: string) {
    const question = await this.db.question.findUnique({ where: { slug } })

    if (!question) {
      return null
    }

    return PrismaQuestionMapper.toEntity(question)
  }

  async getById(id: string) {
    const question = await this.db.question.findUnique({ where: { id } })

    if (!question) {
      return null
    }

    return PrismaQuestionMapper.toEntity(question)
  }

  async getMany({ page, limit }: PaginationParams) {
    const questions = await this.db.question.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: (page - 1) * limit,
    })

    return questions.map((question) => PrismaQuestionMapper.toEntity(question))
  }

  async update(question: Question) {
    const data = PrismaQuestionMapper.toPersistence(question)

    await this.db.question.update({
      where: { id: question.id.toString() },
      data,
    })
  }

  async delete(id: string) {
    await this.db.question.delete({ where: { id } })
  }
}
