import { Module } from '@nestjs/common'
import { CreateQuestionController } from './controllers/questions/create-question.controller'
import { AuthenticateController } from './controllers/users/authenticate.controller'
import { CreateAccountController } from './controllers/users/create-account.controller'
import { DatabaseModule } from '../db/database.module'
import { CreateQuestionUseCase } from '@/domain/forum/app/use-cases/create-question'
import { ListRecentQuestionsController } from './controllers/questions/list-recent-questions'
import { ListRecentQuestionsUseCase } from '@/domain/forum/app/use-cases/list-recent-questions'
import { AuthenticateStudentUseCase } from '@/domain/forum/app/use-cases/authenticate-student'
import { CryptoModule } from '../crypto/crypto.module'
import { RegisterStudentUseCase } from '@/domain/forum/app/use-cases/register-student'

@Module({
  imports: [DatabaseModule, CryptoModule],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateQuestionController,
    ListRecentQuestionsController,
  ],
  providers: [
    CreateQuestionUseCase,
    ListRecentQuestionsUseCase,
    AuthenticateStudentUseCase,
    RegisterStudentUseCase,
  ],
})
export class HttpModule {}
