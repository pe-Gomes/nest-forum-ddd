import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionAttachmentsRepository } from '@/domain/forum/app/repositories/question-attachments-repository'
import { QuestionsRepository } from '@/domain/forum/app/repositories/questions-repository'
import { Question } from '@/domain/forum/enterprise/entities/question'
import { Injectable } from '@nestjs/common'
import { PrismaQuestionMapper } from '../mappers/prisma-question-mapper'
import { PrismaService } from '../prisma.service'
import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects/question-details'
import {
  PrismaQuestionDetails,
  PrismaQuestionDetailsMapper,
} from '../mappers/prisma-question-details-mapper'
import { DomainEvents } from '@/core/events/domain-events'
import { CacheRepository } from '@/infra/cache/cache-repository'

//TODO: Convert multiple promisses to transactions
@Injectable()
export class PrismaQuestionsRepository implements QuestionsRepository {
  constructor(
    private readonly db: PrismaService,
    private cacheRepository: CacheRepository,
    private questionAttachmentsRepo: QuestionAttachmentsRepository,
  ) {}

  async create(question: Question) {
    const prismaQuestion = PrismaQuestionMapper.toPersistence(question)

    await this.db.question.create({ data: prismaQuestion })
    await this.questionAttachmentsRepo.createMany(
      question.attachments.getItems(),
    )

    DomainEvents.dispatchEventsForAggregate(question.id)
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

  async getBySlugWithDetails(slug: string): Promise<QuestionDetails | null> {
    const cached = await this.cacheRepository.get(`question:${slug}:details`)

    if (cached) {
      const prismaQuestion = JSON.parse(cached) as PrismaQuestionDetails

      return PrismaQuestionDetailsMapper.toEntity(prismaQuestion)
    }

    const question = await this.db.question.findUnique({
      where: { slug },
      include: { author: true, attachments: true },
    })

    if (!question) return null

    await this.cacheRepository.set(
      `question:${slug}:details`,
      JSON.stringify(question),
    )

    return PrismaQuestionDetailsMapper.toEntity(question)
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

    await this.questionAttachmentsRepo.createMany(
      question.attachments.getNewItems(),
    )
    await this.questionAttachmentsRepo.deleteMany(
      question.attachments.getRemovedItems(),
    )
    await this.cacheRepository.delete(`question:${question.slug.value}:details`)

    DomainEvents.dispatchEventsForAggregate(question.id)
  }

  async delete(id: string) {
    await this.db.question.delete({ where: { id } })
  }
}
