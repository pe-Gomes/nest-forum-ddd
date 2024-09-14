import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './auth/auth.module'
import { CreateQuestionController } from './http/controllers/questions/create-question.controller'
import { AuthenticateController } from './http/controllers/users/authenticate.controller'
import { CreateAccountController } from './http/controllers/users/create-account.controller'
import { PrismaService } from './prisma/prisma.service'
import { envSchema } from './env'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    AuthModule,
  ],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateQuestionController,
  ],
  providers: [PrismaService],
})
export class AppModule {}
