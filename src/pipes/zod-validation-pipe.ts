import {
  BadRequestException,
  type ArgumentMetadata,
  type PipeTransform,
} from '@nestjs/common'
import { type ZodRawShape, type ZodObject, ZodError } from 'zod'

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodObject<ZodRawShape>) {}

  transform(value: unknown, _: ArgumentMetadata) {
    try {
      this.schema.parse(value)
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException({
          message: 'Bad Request',
          statusCode: 400,
          errors: error.flatten().fieldErrors,
        })
      }

      throw new BadRequestException({
        message: 'Bad Request',
        statusCode: 400,
        description: 'Invalid request.',
      })
    }

    return value
  }
}
