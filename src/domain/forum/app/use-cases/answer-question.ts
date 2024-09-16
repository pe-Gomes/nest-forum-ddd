import { EntityID } from '@/core/entities/value-objects/entity-id'
import { Answer } from '../../enterprise/entities/answer'
import { AnswersRepository } from '../repositories/answers-repository'
import { success, type Either } from '@/core/either'
import { AnswerAttachment } from '../../enterprise/entities/answer-attachment'
import { AnswerAttachmentList } from '../../enterprise/entities/answer-attachment-list'
import { Injectable } from '@nestjs/common'

type AnswerQuestionRequest = {
  authorId: string
  questionId: string
  content: string
  attachmentsIds?: string[]
}

type AnswerQuestionResponse = Either<null, { answer: Answer }>

@Injectable()
export class AnswerQuestionUseCase {
  constructor(private answersRepository: AnswersRepository) {}

  async execute({
    authorId,
    questionId,
    content,
    attachmentsIds,
  }: AnswerQuestionRequest): Promise<AnswerQuestionResponse> {
    const answer = Answer.create({
      content,
      authorId: new EntityID(authorId),
      questionId: new EntityID(questionId),
    })

    if (attachmentsIds) {
      const questionAttachments = attachmentsIds.map((attachmentId) => {
        return AnswerAttachment.create({
          attachmentId: new EntityID(attachmentId),
          answerId: answer.id,
        })
      })

      answer.attachments = new AnswerAttachmentList(questionAttachments)
    }

    await this.answersRepository.create(answer)

    return success({ answer })
  }
}
