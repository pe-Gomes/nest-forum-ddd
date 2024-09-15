import {
  Body,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { z } from 'zod'
import { AuthenticateStudentUseCase } from '@/domain/forum/app/use-cases/authenticate-student'

const authenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>

@Controller('/sessions')
export class AuthenticateController {
  constructor(private authenticate: AuthenticateStudentUseCase) {}

  @Post()
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  @HttpCode(201)
  async handle(@Body() body: AuthenticateBodySchema) {
    const { email, password } = body

    const res = await this.authenticate.execute({ password, email })

    if (res.isFailure()) {
      throw new UnauthorizedException(res.value)
    }

    return { access_token: res.value.accessToken }
  }
}
