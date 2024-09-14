import { EntityID } from '@/core/entities/value-objects/entity-id'
import { Answer } from '../../enterprise/entities/answer'
import { type AnswersRepository } from '../repositories/answers-repository'
import { success, type Either } from '@/core/either'
import { AnswerAttachment } from '../../enterprise/entities/answer-attachment'
import { AnswerAttachmentList } from '../../enterprise/entities/answer-attachment-list'

type AnswerQuestionRequest = {
  instructorId: string
  questionId: string
  content: string
  attachmentsIds?: string[]
}

type AnswerQuestionResponse = Either<null, { answer: Answer }>

export class AnswerQuestionUseCase {
  constructor(private answersRepository: AnswersRepository) {}

  async execute({
    instructorId,
    questionId,
    content,
    attachmentsIds,
  }: AnswerQuestionRequest): Promise<AnswerQuestionResponse> {
    const answer = Answer.create({
      content,
      authorId: new EntityID(instructorId),
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
