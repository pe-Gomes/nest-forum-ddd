import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from '@nestjs/common'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { RegisterStudentUseCase } from '@/domain/forum/app/use-cases/register-student'
import { z } from 'zod'
import { StudentAlreadyExistsError } from '@/domain/forum/app/use-cases/errors'

const createAccountBodySchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
})

type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>

@Controller('/accounts')
export class CreateAccountController {
  constructor(private registerStudent: RegisterStudentUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  async handle(@Body() body: CreateAccountBodySchema) {
    const { name, email, password } = body

    const res = await this.registerStudent.execute({ name, email, password })

    if (res.isFailure()) {
      const err = res.value

      switch (err.constructor) {
        case StudentAlreadyExistsError:
          throw new ConflictException(err.message)
        default:
          throw new BadRequestException(err.message)
      }
    }
  }
}
