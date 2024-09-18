import { OnAnswerCreated } from '@/domain/notification/app/subscribers/on-answer-created'
import { OnSetQuestionBestAnswer } from '@/domain/notification/app/subscribers/on-set-question-best-answer'
import { SendNotificationUseCase } from '@/domain/notification/app/use-cases/send-notification'
import { Module } from '@nestjs/common'
import { DatabaseModule } from '../db/database.module'

@Module({
  imports: [DatabaseModule],
  providers: [
    OnAnswerCreated,
    OnSetQuestionBestAnswer,
    SendNotificationUseCase,
  ],
})
export class EventsModule {}
