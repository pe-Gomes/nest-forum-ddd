import { type Either, failure, success } from '@/core/either'
import { type AnswersRepository } from '../repositories/answers-repository'
import { NotAllowedError, ResourceNotFoundError } from '@/core/errors'
import { type AnswerAttachmentsRepository } from '../repositories/answer-attachments-repository'

type DeleteAnswerRequest = {
  id: string
  authorId: string
}

type DeleteAnswerResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  object
>

export class DeleteAnswerUseCase {
  constructor(
    private answerRepository: AnswersRepository,
    private answerAttachmentRepository: AnswerAttachmentsRepository,
  ) {}

  async execute({
    id,
    authorId,
  }: DeleteAnswerRequest): Promise<DeleteAnswerResponse> {
    const question = await this.answerRepository.getById(id)

    if (!question) {
      return failure(new ResourceNotFoundError())
    }

    if (question.authorId.toString() !== authorId) {
      return failure(new NotAllowedError())
    }

    await this.answerRepository.delete(id)
    await this.answerAttachmentRepository.deleteManyByAnswerId(id)

    return success({})
  }
}
