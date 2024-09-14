import { type Answer } from '@/domain/forum/enterprise/entities/answer'
import { type AnswersRepository } from '@/domain/forum/app/repositories/answers-repository'
import { DomainEvents } from '@/core/events/domain-events'

export class InMemoryAnswerRepository implements AnswersRepository {
  public answers: Answer[] = []

  async create(answer: Answer) {
    await Promise.resolve(this.answers.push(answer))

    DomainEvents.dispatchEventsForAggregate(answer.id)
  }

  async getById(id: string) {
    return await Promise.resolve(
      this.answers.find((question) => question.id.toString() === id) ?? null,
    )
  }

  async findManyByQuestionId({
    questionId,
    page,
    limit,
  }: {
    questionId: string
    page: number
    limit: number
  }) {
    return await Promise.resolve(
      this.answers
        .filter((question) => question.questionId.toString() === questionId)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .slice((page - 1) * limit, page * limit),
    )
  }

  async update(answer: Answer) {
    const answerIdx = this.answers.findIndex(
      (item) => item.id.toString() === answer.id.toString(),
    )

    await Promise.resolve((this.answers[answerIdx] = answer))

    DomainEvents.dispatchEventsForAggregate(answer.id)
  }

  async delete(id: string) {
    const questionIdx = this.answers.findIndex(
      (question) => question.id.toString() === id,
    )
    await Promise.resolve(this.answers.splice(questionIdx, 1))
  }
}
