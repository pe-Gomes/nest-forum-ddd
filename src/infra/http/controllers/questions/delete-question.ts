import { NotAllowedError, ResourceNotFoundError } from '@/core/errors'
import { DeleteQuestionUseCase } from '@/domain/forum/app/use-cases/delete-question'
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

@Controller('/questions/:id')
export class DeleteQuestionController {
  constructor(private deleteQuestion: DeleteQuestionUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: TokenPayload,
    @Param('id') questionId: string,
  ) {
    const res = await this.deleteQuestion.execute({
      id: questionId,
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
