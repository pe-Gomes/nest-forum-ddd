import { Either, failure, success } from '@/core/either'
import { Question } from '../../enterprise/entities/question'
import { AnswersRepository } from '../repositories/answers-repository'
import { QuestionsRepository } from '../repositories/questions-repository'
import { NotAllowedError, ResourceNotFoundError } from '@/core/errors'
import { Injectable } from '@nestjs/common'

type SetBestAnswerRequest = {
  authorId: string
  answerId: string
}

type SetBestAnswerResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    question: Question
  }
>

@Injectable()
export class SetBestAnswerUseCase {
  constructor(
    private questionRepository: QuestionsRepository,
    private answerRepository: AnswersRepository,
  ) {}

  async execute({
    authorId,
    answerId,
  }: SetBestAnswerRequest): Promise<SetBestAnswerResponse> {
    const answer = await this.answerRepository.getById(answerId)

    if (!answer) {
      return failure(new ResourceNotFoundError())
    }

    const question = await this.questionRepository.getById(
      answer.questionId.toString(),
    )

    if (!question) {
      return failure(new ResourceNotFoundError())
    }

    if (question.authorId.toString() !== authorId) {
      return failure(new NotAllowedError())
    }

    question.bestAnswerId = answer.id

    await this.questionRepository.update(question)

    return success({ question })
  }
}
