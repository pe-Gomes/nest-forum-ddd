import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Post,
} from '@nestjs/common'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { TokenPayload } from '@/infra/auth/jwt.strategy'
import { CommentOnAnswerUseCase } from '@/domain/forum/app/use-cases/comment-on-answer'
import { z } from 'zod'

const commentOnAnswerBodySchema = z.object({
  content: z.string().min(1),
})

type CommentOnQuestionBody = z.infer<typeof commentOnAnswerBodySchema>

const bodyPipe = new ZodValidationPipe(commentOnAnswerBodySchema)

@Controller('/answers/:id/comments')
export class CommentOnAnswerController {
  constructor(private commentOnQuestion: CommentOnAnswerUseCase) {}

  @Post()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: TokenPayload,
    @Param('id') answerId: string,
    @Body(bodyPipe) body: CommentOnQuestionBody,
  ) {
    const { content } = body

    const res = await this.commentOnQuestion.execute({
      content,
      authorId: user.sub,
      answerId,
    })

    if (res.isFailure()) {
      throw new BadRequestException(res.value.message)
    }
  }
}
