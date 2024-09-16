import { NotAllowedError, ResourceNotFoundError } from '@/core/errors'
import { DeleteQuestionCommentUseCase } from '@/domain/forum/app/use-cases/delete-question-comment'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { TokenPayload } from '@/infra/auth/jwt.strategy'
import {
  BadRequestException,
  Controller,
  Delete,
  ForbiddenException,
  HttpCode,
  Param,
} from '@nestjs/common'

@Controller('/comments/:id/question')
export class DeleteCommentController {
  constructor(private deleteComment: DeleteQuestionCommentUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: TokenPayload,
    @Param('id') commentId: string,
  ) {
    const res = await this.deleteComment.execute({
      authorId: user.sub,
      commentId,
    })

    if (res.isFailure()) {
      const err = res.value

      switch (err.constructor) {
        case ResourceNotFoundError:
          throw new BadRequestException(err.message)
        case NotAllowedError:
          throw new ForbiddenException(err.message)
        default:
          throw new BadRequestException(err.message)
      }
    }
  }
}
