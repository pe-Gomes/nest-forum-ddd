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
import { GetQuestionBySlugUseCase } from '@/domain/forum/app/use-cases/get-question-by-slug'
import { GetQuestionBySlugController } from './controllers/questions/get-question-by-slug'
import { EditQuestionUseCase } from '@/domain/forum/app/use-cases/edit-question'
import { EditQuestionController } from './controllers/questions/edit-question'
import { DeleteQuestionController } from './controllers/questions/delete-question'
import { DeleteQuestionUseCase } from '@/domain/forum/app/use-cases/delete-question'
import { AnswerQuestionController } from './controllers/answers/answer-question'
import { AnswerQuestionUseCase } from '@/domain/forum/app/use-cases/answer-question'
import { EditAnswerController } from './controllers/answers/edit-answer'
import { EditAnswerUseCase } from '@/domain/forum/app/use-cases/edit-answer'
import { DeleteAnswerController } from './controllers/answers/delete-answer'
import { DeleteAnswerUseCase } from '@/domain/forum/app/use-cases/delete-answer'
import { ListAnswersForQuestionController } from './controllers/answers/list-answers-for-question'
import { ListAnswersForQuestionUseCase } from '@/domain/forum/app/use-cases/list-answers-for-question'
import { SetBestAnswerController } from './controllers/answers/set-best-answer'
import { SetBestAnswerUseCase } from '@/domain/forum/app/use-cases/set-best-answer'

@Module({
  imports: [DatabaseModule, CryptoModule],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateQuestionController,
    ListRecentQuestionsController,
    GetQuestionBySlugController,
    EditQuestionController,
    DeleteQuestionController,
    AnswerQuestionController,
    EditAnswerController,
    DeleteAnswerController,
    ListAnswersForQuestionController,
    SetBestAnswerController,
  ],
  providers: [
    CreateQuestionUseCase,
    ListRecentQuestionsUseCase,
    AuthenticateStudentUseCase,
    RegisterStudentUseCase,
    GetQuestionBySlugUseCase,
    EditQuestionUseCase,
    DeleteQuestionUseCase,
    AnswerQuestionUseCase,
    EditAnswerUseCase,
    DeleteAnswerUseCase,
    ListAnswersForQuestionUseCase,
    SetBestAnswerUseCase,
  ],
})
export class HttpModule {}
