import { type Either, failure, success } from '@/core/either'
import { type Question } from '../../enterprise/entities/question'
import { QuestionsRepository } from '../repositories/questions-repository'
import { ResourceNotFoundError } from '@/core/errors'
import { Injectable } from '@nestjs/common'

type GetQuestionBySlugRequest = {
  slug: string
}

type GetQuestionBySlugResponse = Either<
  ResourceNotFoundError,
  {
    question: Question
  }
>

@Injectable()
export class GetQuestionBySlugUseCase {
  constructor(private questionRepository: QuestionsRepository) {}
  async execute({
    slug,
  }: GetQuestionBySlugRequest): Promise<GetQuestionBySlugResponse> {
    const question = await this.questionRepository.getBySlug(slug)

    if (!question) {
      return failure(new ResourceNotFoundError())
    }

    return success({ question })
  }
}
