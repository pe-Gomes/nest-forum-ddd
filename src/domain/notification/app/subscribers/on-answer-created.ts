import { type EventHandler } from '@/core/events/event-handler'
import { type QuestionsRepository } from '@/domain/forum/app/repositories/questions-repository'
import { type SendNotificationUseCase } from '../use-cases/send-notification'

import { DomainEvents } from '@/core/events/domain-events'
import { AnswerCreatedEvent } from '@/domain/forum/enterprise/events/answer-created-event'

export class OnAnswerCreated implements EventHandler {
  constructor(
    private questionsRepository: QuestionsRepository,
    private sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscription()
  }

  setupSubscription() {
    DomainEvents.register(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      this.sendNewAnswerNotification.bind(this),
      AnswerCreatedEvent.name,
    )
  }

  private async sendNewAnswerNotification({ answer }: AnswerCreatedEvent) {
    const question = await this.questionsRepository.getById(
      answer.questionId.toString(),
    )

    if (!question) {
      console.error('Question not found on sendNewAnswerNotification')
      return
    }

    await this.sendNotification.execute({
      recipientId: question.authorId.toString(),
      title: `New Answer on ${question.title.substring(0, 40).concat('...')}`,
      content: answer.excerpt,
    })

    console.log('Notification sent')
  }
}
