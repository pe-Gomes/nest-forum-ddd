import { EntityID } from '@/core/entities/value-objects/entity-id'
import { Question } from '../../enterprise/entities/question'
import { type QuestionsRepository } from '../repositories/questions-repository'
import { QuestionAttachment } from '../../enterprise/entities/question-attachment'
import { type Either, success } from '@/core/either'
import { QuestionAttachmentList } from '../../enterprise/entities/question-attachment-list'

type CreateQuestionRequest = {
  authorId: string
  title: string
  content: string
  attachmentsIds?: string[]
}

type CreateQuestionResponse = Either<null, { question: Question }>

export class CreateQuestionUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}

  async execute({
    title,
    authorId,
    content,
    attachmentsIds,
  }: CreateQuestionRequest): Promise<CreateQuestionResponse> {
    const question = Question.create({
      title,
      content,
      authorId: new EntityID(authorId),
    })

    if (attachmentsIds) {
      const questionAttachments = attachmentsIds.map((attachmentId) => {
        return QuestionAttachment.create({
          attachmentId: new EntityID(attachmentId),
          questionId: question.id,
        })
      })

      question.attachments = new QuestionAttachmentList(questionAttachments)
    }

    await this.questionsRepository.create(question)
    return success({ question })
  }
}
