import { NotAllowedError, ResourceNotFoundError } from '@/core/errors'
import { ReadNotificationUseCase } from '@/domain/notification/app/use-cases/read-notification'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { TokenPayload } from '@/infra/auth/jwt.strategy'
import {
  BadRequestException,
  Controller,
  ForbiddenException,
  HttpCode,
  Param,
  Patch,
} from '@nestjs/common'

@Controller('/notifications/:id/read')
export class ReadNotificationController {
  constructor(private readNotification: ReadNotificationUseCase) {}

  @Patch()
  @HttpCode(204)
  async hanlde(
    @CurrentUser() user: TokenPayload,
    @Param('id') notificationId: string,
  ) {
    const res = await this.readNotification.execute({
      notificationId,
      recipientId: user.sub,
    })

    if (res.isFailure()) {
      const err = res.value

      switch (err.constructor) {
        case NotAllowedError:
          throw new ForbiddenException(err.message)
        case ResourceNotFoundError:
          throw new BadRequestException(err.message)
        default:
          throw new BadRequestException(err.message)
      }
    }
  }
}
