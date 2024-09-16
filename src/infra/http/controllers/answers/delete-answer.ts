import { NotAllowedError, ResourceNotFoundError } from '@/core/errors'
import { DeleteAnswerUseCase } from '@/domain/forum/app/use-cases/delete-answer'
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

@Controller('/answers/:id')
export class DeleteAnswerController {
  constructor(private deleteAnswer: DeleteAnswerUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: TokenPayload,
    @Param('id') answerId: string,
  ) {
    const res = await this.deleteAnswer.execute({
      id: answerId,
      authorId: user.sub,
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
