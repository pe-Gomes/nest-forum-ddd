import {
  Body,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common'
import { PrismaService } from '@/infra/db/prisma/prisma.service'
import { JwtService } from '@nestjs/jwt'
import { comparePassword } from 'src/lib/utils/hash'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { z } from 'zod'

const authenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>

@Controller('/sessions')
export class AuthenticateController {
  constructor(
    private jwt: JwtService,
    private db: PrismaService,
  ) {}

  @Post()
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  @HttpCode(201)
  async handle(@Body() body: AuthenticateBodySchema) {
    const { email, password } = body

    const user = await this.db.user.findUnique({
      where: { email },
    })

    if (!user) {
      throw new UnauthorizedException({
        message: 'Unauthorized',
        statusCode: 401,
        error: 'Invalid credentials.',
      })
    }

    const isPasswordValid = await comparePassword(password, user.passwordHash)

    if (!isPasswordValid) {
      throw new UnauthorizedException({
        message: 'Unauthorized',
        statusCode: 401,
        error: 'Invalid credentials.',
      })
    }

    const token = this.jwt.sign({ sub: user.id })

    return { access_token: token }
  }
}
