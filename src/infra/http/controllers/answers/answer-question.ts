import { AnswerQuestionUseCase } from '@/domain/forum/app/use-cases/answer-question'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { TokenPayload } from '@/infra/auth/jwt.strategy'
import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Post,
} from '@nestjs/common'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { z } from 'zod'

const answerQuestionBodySchema = z.object({
  content: z.string().min(1),
  attachmentsIds: z.array(z.string().uuid()).optional(),
})

type AnswerQuestionBody = z.infer<typeof answerQuestionBodySchema>

const bodyPipe = new ZodValidationPipe(answerQuestionBodySchema)

@Controller('/questions/:id/answers')
export class AnswerQuestionController {
  constructor(private answerQuestion: AnswerQuestionUseCase) {}

  @Post()
  async handle(
    @CurrentUser() user: TokenPayload,
    @Param('id') questionId: string,
    @Body(bodyPipe) body: AnswerQuestionBody,
  ) {
    const { content, attachmentsIds } = body

    const result = await this.answerQuestion.execute({
      authorId: user.sub,
      questionId,
      content,
      attachmentsIds,
    })

    if (result.isFailure()) {
      throw new BadRequestException()
    }
  }
}
