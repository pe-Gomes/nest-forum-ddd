import { Module } from '@nestjs/common'
import { CreateQuestionController } from './controllers/questions/create-question.controller'
import { AuthenticateController } from './controllers/users/authenticate.controller'
import { CreateAccountController } from './controllers/users/create-account.controller'
import { DatabaseModule } from '../db/database.module'
import { CreateQuestionUseCase } from '@/domain/forum/app/use-cases/create-question'

@Module({
  imports: [DatabaseModule],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateQuestionController,
  ],
  providers: [CreateQuestionUseCase],
})
export class HttpModule {}
