import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { CreateAccountController } from './controllers/users/create-account.controller'
import { AuthenticateController } from './controllers/users/authenticate.controller'
import { CreateQuestionController } from './controllers/questions/create-question.controller'
import { PrismaService } from '../prisma/prisma.service'
import { AuthModule } from '../auth/auth.module'
import { envSchema } from '../env'

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
