import { EntityID } from '@/core/entities/value-objects/entity-id'
import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects/question-details'
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug'
import {
  type Attachment as PrismaAttachment,
  type Question as PrismaQuestion,
  type User as PrismaUser,
} from '@prisma/client'
import { PrismaAttachmentMapper } from './prisma-attachment-mapper'

export type PrismaQuestionDetails = PrismaQuestion & {
  author: PrismaUser
  attachments: PrismaAttachment[]
}

export class PrismaQuestionDetailsMapper {
  static toEntity(data: PrismaQuestionDetails): QuestionDetails {
    return QuestionDetails.create({
      questionId: new EntityID(data.id),
      authorId: new EntityID(data.author.id),
      authorName: data.author.name,
      title: data.title,
      content: data.content,
      slug: new Slug(data.slug),
      bestAnswerId: data.bestAnswerId ? new EntityID(data.bestAnswerId) : null,
      attachments: data.attachments.map((att) =>
        PrismaAttachmentMapper.toEntity(att),
      ),
      createdAt: data.createdAt,
      updatedAt: data.updatedAt ?? null,
    })
  }
}
