import { QuestionComment } from '../../enterprise/entities/question-comment'
import { QuestionsRepository } from '../repositories/questions-repository'
import { QuestionCommentsRepository } from '../repositories/question-comments-repository'
import { EntityID } from '@/core/entities/value-objects/entity-id'
import { Either, failure, success } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { ResourceNotFoundError } from '@/core/errors'

type CommentOnQuestionRequest = {
  authorId: string
  questionId: string
  content: string
}

type CommentOnQuestionResponse = Either<
  ResourceNotFoundError,
  {
    comment: QuestionComment
  }
>

@Injectable()
export class CommentOnQuestionUseCase {
  constructor(
    private questionRepository: QuestionsRepository,
    private questionCommentRepository: QuestionCommentsRepository,
  ) {}

  async execute({
    authorId,
    questionId,
    content,
  }: CommentOnQuestionRequest): Promise<CommentOnQuestionResponse> {
    const question = await this.questionRepository.getById(questionId)

    if (!question) {
      return failure(new ResourceNotFoundError())
    }

    const comment = QuestionComment.create({
      authorId: new EntityID(authorId),
      questionId: question.id,
      content,
    })

    await this.questionCommentRepository.create(comment)

    return success({ comment })
  }
}
