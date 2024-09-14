import { type Answer } from '../../enterprise/entities/answer'
import { type AnswersRepository } from '../repositories/answers-repository'
import { type Either, failure, success } from '@/core/either'
import { type AnswerAttachmentsRepository } from '../repositories/answer-attachments-repository'

import { NotAllowedError, ResourceNotFoundError } from '@/core/errors'
import { AnswerAttachment } from '../../enterprise/entities/answer-attachment'
import { EntityID } from '@/core/entities/value-objects/entity-id'
import { AnswerAttachmentList } from '../../enterprise/entities/answer-attachment-list'

type EditAnswerRequest = {
  authorId: string
  answerId: string
  content: string
  attachmentsIds?: string[]
}

type EditAnswerResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  {
    answer: Answer
  }
>

export class EditAnswerUseCase {
  constructor(
    private answerRepository: AnswersRepository,
    private answerAttachmentRepository: AnswerAttachmentsRepository,
  ) {}
  async execute(args: EditAnswerRequest): Promise<EditAnswerResponse> {
    const answer = await this.answerRepository.getById(args.answerId)

    if (!answer) {
      return failure(new ResourceNotFoundError())
    }

    if (answer.authorId.toString() !== args.authorId) {
      return failure(new NotAllowedError())
    }

    // Handle new attachments
    const currentAnswerAttachments =
      await this.answerAttachmentRepository.getManyByAnswerId(
        answer.id.toString(),
      )

    const answerAttachmentList = new AnswerAttachmentList(
      currentAnswerAttachments,
    )

    const answerAttachments = args.attachmentsIds?.map((id) =>
      AnswerAttachment.create({
        answerId: answer.id,
        attachmentId: new EntityID(id),
      }),
    )

    if (answerAttachments) {
      answerAttachmentList.update(answerAttachments)
    }

    answer.content = args.content
    answer.attachments = answerAttachmentList

    await this.answerRepository.update(answer)

    return success({ answer })
  }
}
