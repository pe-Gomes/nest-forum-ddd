import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { TokenPayload } from '@/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { CreateQuestionUseCase } from '@/domain/forum/app/use-cases/create-question'
import { z } from 'zod'

const createQuestionSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
})

type CreateQuestionSchema = z.infer<typeof createQuestionSchema>
const bodyValidationPipe = new ZodValidationPipe(createQuestionSchema)

@Controller('/questions')
export class CreateQuestionController {
  constructor(private createQuestion: CreateQuestionUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(
    @CurrentUser() user: TokenPayload,
    @Body(bodyValidationPipe) body: CreateQuestionSchema,
  ) {
    const { title, content } = body

    const res = await this.createQuestion.execute({
      title,
      content,
      authorId: user.sub,
    })

    if (res.isFailure()) {
      throw new BadRequestException()
    }
  }
}
