import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common'
import { JwtAuthGuard } from 'src/auth/auth.guard'
import { CurrentUser } from 'src/auth/current-user.decorator'
import { TokenPayload } from 'src/auth/jwt.strategy'
import { PrismaService } from 'src/infra/prisma/prisma.service'
import { createSlugFromText } from 'src/lib/utils/slug'
import { ZodValidationPipe } from 'src/pipes/zod-validation-pipe'
import { z } from 'zod'

const createQuestionSchema = z.object({
  title: z
    .string()
    .min(1, { message: 'Title must be at least 1 character long' }),
  content: z
    .string()
    .min(1, { message: 'Content must be at least 1 character long' }),
})

type CreateQuestionSchema = z.infer<typeof createQuestionSchema>

@Controller('/questions')
export class CreateQuestionController {
  constructor(private readonly db: PrismaService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ZodValidationPipe(createQuestionSchema))
  async handle(
    @CurrentUser() user: TokenPayload,
    @Body() body: CreateQuestionSchema,
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
