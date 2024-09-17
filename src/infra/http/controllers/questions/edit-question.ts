import { EditQuestionUseCase } from '@/domain/forum/app/use-cases/edit-question'
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

const editQuestionBodySchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  attachmentsIds: z.array(z.string().uuid()).optional(),
})

type EditQuestionBody = z.infer<typeof editQuestionBodySchema>

const bodyPipe = new ZodValidationPipe(editQuestionBodySchema)

@Controller('/questions/:id')
export class EditQuestionController {
  constructor(private editQuestion: EditQuestionUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: TokenPayload,
    @Param('id') questionId: string,
    @Body(bodyPipe) body: EditQuestionBody,
  ) {
    const { title, content, attachmentsIds } = body

    const res = await this.editQuestion.execute({
      title,
      content,
      attachmentsIds,
      questionId,
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
