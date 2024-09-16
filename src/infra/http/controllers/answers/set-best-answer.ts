import {
  BadRequestException,
  Controller,
  ForbiddenException,
  HttpCode,
  Param,
  Patch,
} from '@nestjs/common'
import { SetBestAnswerUseCase } from '@/domain/forum/app/use-cases/set-best-answer'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { TokenPayload } from '@/infra/auth/jwt.strategy'
import { NotAllowedError, ResourceNotFoundError } from '@/core/errors'

@Controller('/answers/:id/best-answer')
export class SetBestAnswerController {
  constructor(private setBestAnswer: SetBestAnswerUseCase) {}

  @Patch()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: TokenPayload,
    @Param('id') answerId: string,
  ) {
    const res = await this.setBestAnswer.execute({
      authorId: user.sub,
      answerId: answerId,
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
