import { Module } from '@nestjs/common'
import { CreateQuestionController } from './controllers/questions/create-question.controller'
import { AuthenticateController } from './controllers/users/authenticate.controller'
import { CreateAccountController } from './controllers/users/create-account.controller'
import { DatabaseModule } from '../db/database.module'
import { CreateQuestionUseCase } from '@/domain/forum/app/use-cases/create-question'
import { ListRecentQuestionsController } from './controllers/questions/list-recent-questions'
import { ListRecentQuestionsUseCase } from '@/domain/forum/app/use-cases/list-recent-questions'

@Module({
  imports: [DatabaseModule],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateQuestionController,
    ListRecentQuestionsController,
  ],
  providers: [CreateQuestionUseCase, ListRecentQuestionsUseCase],
})
export class HttpModule {}
