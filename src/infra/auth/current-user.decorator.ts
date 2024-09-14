import { createParamDecorator, type ExecutionContext } from '@nestjs/common'
import { type TokenPayload } from './jwt.strategy'

export const CurrentUser = createParamDecorator(
  (_: never, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest<{ user: TokenPayload }>()

    return req.user
  },
)
