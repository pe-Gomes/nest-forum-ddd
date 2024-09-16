import { type Either, failure, success } from '@/core/either'
import { QuestionsRepository } from '../repositories/questions-repository'
import { NotAllowedError, ResourceNotFoundError } from '@/core/errors'
import { QuestionAttachmentsRepository } from '../repositories/question-attachments-repository'
import { Injectable } from '@nestjs/common'

type DeleteQuestionRequest = {
  id: string
  authorId: string
}

type DeleteQuestionResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  object
>

@Injectable()
export class DeleteQuestionUseCase {
  constructor(
    private questionRepository: QuestionsRepository,
    private questionAttachmentRepository: QuestionAttachmentsRepository,
  ) {}

  async execute({
    id,
    authorId,
  }: DeleteQuestionRequest): Promise<DeleteQuestionResponse> {
    const question = await this.questionRepository.getById(id)

    if (!question) {
      return failure(new ResourceNotFoundError())
    }

    if (question.authorId.toString() !== authorId) {
      return failure(new NotAllowedError())
    }

    await this.questionRepository.delete(id)

    await this.questionAttachmentRepository.deleteManyByQuestionId(id)

    return success({})
  }
}
