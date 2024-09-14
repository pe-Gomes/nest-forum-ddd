import { QuestionComment } from '../../enterprise/entities/question-comment'
import { type QuestionsRepository } from '../repositories/questions-repository'
import { type QuestionCommentsRepository } from '../repositories/question-comments-repository'
import { EntityID } from '@/core/entities/value-objects/entity-id'

type CommentOnQuestionRequest = {
  authorId: string
  questionId: string
  content: string
}

type CommentOnQuestionResponse = {
  comment: QuestionComment
}

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
      throw new Error('Question not found')
    }

    const comment = QuestionComment.create({
      authorId: new EntityID(authorId),
      questionId: question.id,
      content,
    })

    await this.questionCommentRepository.create(comment)

    return { comment }
  }
}
