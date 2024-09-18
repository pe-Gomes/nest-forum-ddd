import { AnswersRepository } from '@/domain/forum/app/repositories/answers-repository'
import { Injectable } from '@nestjs/common'
import { SendNotificationUseCase } from '../use-cases/send-notification'
import { EventHandler } from '@/core/events/event-handler'
import { DomainEvents } from '@/core/events/domain-events'
import { SetQuestionBestAnswerEvent } from '@/domain/forum/enterprise/events/set-question-best-answer-event'

@Injectable()
export class OnSetQuestionBestAnswer implements EventHandler {
  constructor(
    private answersRepository: AnswersRepository,
    private sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscription()
  }
  setupSubscription(): void {
    DomainEvents.register(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      this.sendQuestionBestAnswerNotification.bind(this),
      SetQuestionBestAnswerEvent.name,
    )
  }

  private async sendQuestionBestAnswerNotification({
    question,
    bestAnswerId,
  }: SetQuestionBestAnswerEvent) {
    const answer = await this.answersRepository.getById(bestAnswerId.toString())

    if (answer) {
      await this.sendNotification.execute({
        recipientId: answer.authorId.toString(),
        title: 'Your answer was chosen as the best answer',
        content: `Your answer to the question "${question.title.substring(0, 20).concat('...')}" was chosen as the best answer by the author!`,
      })

      console.log('Notification sent')
    }
  }
}
