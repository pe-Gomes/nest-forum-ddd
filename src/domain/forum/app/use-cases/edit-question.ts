import { Either, failure, success } from '@/core/either'
import { ResourceNotFoundError, NotAllowedError } from '@/core/errors'
import { Question } from '../../enterprise/entities/question'
import { QuestionsRepository } from '../repositories/questions-repository'
import { QuestionAttachmentList } from '../../enterprise/entities/question-attachment-list'
import { QuestionAttachmentsRepository } from '../repositories/question-attachments-repository'
import { QuestionAttachment } from '../../enterprise/entities/question-attachment'
import { EntityID } from '@/core/entities/value-objects/entity-id'
import { Injectable } from '@nestjs/common'

type EditQuestionRequest = {
  authorId: string
  questionId: string
  title: string
  content: string
  attachmentsIds?: string[]
}

type EditQuestionResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  {
    question: Question
  }
>

@Injectable()
export class EditQuestionUseCase {
  constructor(
    private questionRepository: QuestionsRepository,
    private questionAttachmentRepository: QuestionAttachmentsRepository,
  ) {}
  async execute({
    authorId,
    questionId,
    title,
    content,
    attachmentsIds,
  }: EditQuestionRequest): Promise<EditQuestionResponse> {
    const question = await this.questionRepository.getById(questionId)

    if (!question) {
      return failure(new ResourceNotFoundError())
    }

    if (question.authorId.toString() !== authorId) {
      return failure(new NotAllowedError())
    }

    // Handle new attachments
    const currentQuestionAttachments =
      await this.questionAttachmentRepository.getManyByQuestionId(
        question.id.toString(),
      )

    const questionAttachmentList = new QuestionAttachmentList(
      currentQuestionAttachments,
    )

    if (attachmentsIds) {
      const questionAttachments = attachmentsIds.map((id) =>
        QuestionAttachment.create({
          questionId: question.id,
          attachmentId: new EntityID(id),
        }),
      )

      questionAttachmentList.update(questionAttachments)
    }

    question.title = title
    question.content = content
    question.attachments = questionAttachmentList

    await this.questionRepository.update(question)

    return success({ question })
  }
}
