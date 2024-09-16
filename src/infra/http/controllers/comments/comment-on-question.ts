import { CommentOnQuestionUseCase } from '@/domain/forum/app/use-cases/comment-on-question'
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Post,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { TokenPayload } from '@/infra/auth/jwt.strategy'

const commentOnQuestionBodySchema = z.object({
  content: z.string().min(1),
})

type CommentOnQuestionBody = z.infer<typeof commentOnQuestionBodySchema>

const bodyPipe = new ZodValidationPipe(commentOnQuestionBodySchema)

@Controller('/questions/:id/comments')
export class CommentOnQuestionController {
  constructor(private commentOnQuestion: CommentOnQuestionUseCase) {}

  @Post()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: TokenPayload,
    @Param('id') questionId: string,
    @Body(bodyPipe) body: CommentOnQuestionBody,
  ) {
    const { content } = body

    const res = await this.commentOnQuestion.execute({
      content,
      authorId: user.sub,
      questionId,
    })

    if (res.isFailure()) {
      throw new BadRequestException(res.value.message)
    }
  }
}
