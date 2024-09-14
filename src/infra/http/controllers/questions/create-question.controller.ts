import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/auth.guard'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { TokenPayload } from '@/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { PrismaService } from '@/infra/db/prisma/prisma.service'
import { createSlugFromText } from '@/lib/utils/slug'
import { z } from 'zod'

const createQuestionSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
})

type CreateQuestionSchema = z.infer<typeof createQuestionSchema>
const bodyValidationPipe = new ZodValidationPipe(createQuestionSchema)

@Controller('/questions')
export class CreateQuestionController {
  constructor(private readonly db: PrismaService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(201)
  async handle(
    @CurrentUser() user: TokenPayload,
    @Body(bodyValidationPipe) body: CreateQuestionSchema,
  ) {
    const { title, content } = body

    const slug = createSlugFromText(title)

    await this.db.question.create({
      data: {
        title,
        content,
        slug,
        authorId: user.sub,
      },
    })
  }
}
