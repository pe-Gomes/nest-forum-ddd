import { Body, Controller, HttpCode, Post, UsePipes } from '@nestjs/common'
import { PrismaService } from 'src/infra/prisma/prisma.service'
import { hashPassword } from 'src/lib/utils/hash'
import { ZodValidationPipe } from 'src/pipes/zod-validation-pipe'
import { z } from 'zod'

const createAccountBodySchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
})

type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>

@Controller('/accounts')
export class CreateAccountController {
  constructor(private db: PrismaService) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  async handle(@Body() body: CreateAccountBodySchema) {
    const { name, email, password } = body

    const passwordHash = await hashPassword(password)

    await this.db.user.create({
      data: {
        name,
        email,
        passwordHash,
      },
    })
  }
}
