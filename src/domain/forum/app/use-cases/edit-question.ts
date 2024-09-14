import { type Either, failure, success } from '@/core/either'
import { ResourceNotFoundError, NotAllowedError } from '@/core/errors'
import { type Question } from '../../enterprise/entities/question'
import { type QuestionsRepository } from '../repositories/questions-repository'
import { QuestionAttachmentList } from '../../enterprise/entities/question-attachment-list'
import { type QuestionAttachmentsRepository } from '../repositories/question-attachments-repository'
import { QuestionAttachment } from '../../enterprise/entities/question-attachment'
import { EntityID } from '@/core/entities/value-objects/entity-id'

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

export class EditQuestionUseCase {
  constructor(
    private questionRepository: QuestionsRepository,
    private questionAttachmentRepository: QuestionAttachmentsRepository,
  ) {}
  async execute(args: EditQuestionRequest): Promise<EditQuestionResponse> {
    const question = await this.questionRepository.getById(args.questionId)

    if (!question) {
      return failure(new ResourceNotFoundError())
    }

    if (question.authorId.toString() !== args.authorId) {
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

    const questionAttachments = args.attachmentsIds?.map((id) =>
      QuestionAttachment.create({
        questionId: question.id,
        attachmentId: new EntityID(id),
      }),
    )

    if (questionAttachments) {
      questionAttachmentList.update(questionAttachments)
    }

    question.title = args.title
    question.content = args.content
    question.attachments = questionAttachmentList

    await this.questionRepository.update(question)

    return success({ question })
  }
}
