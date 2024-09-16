import { EditAnswerUseCase } from '@/domain/forum/app/use-cases/edit-answer'
import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  HttpCode,
  Param,
  Put,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { TokenPayload } from '@/infra/auth/jwt.strategy'
import { NotAllowedError, ResourceNotFoundError } from '@/core/errors'

const editAnswerBodySchema = z.object({
  content: z.string().min(1),
  attachmentsIds: z.array(z.string()).optional(),
})

type EditAnswerBody = z.infer<typeof editAnswerBodySchema>

const bodyPipe = new ZodValidationPipe(editAnswerBodySchema)

@Controller('/answers/:id')
export class EditAnswerController {
  constructor(private editAnswer: EditAnswerUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: TokenPayload,
    @Param('id') answerId: string,
    @Body(bodyPipe) body: EditAnswerBody,
  ) {
    const { content, attachmentsIds } = body

    const res = await this.editAnswer.execute({
      content,
      authorId: user.sub,
      attachmentsIds,
      answerId,
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
