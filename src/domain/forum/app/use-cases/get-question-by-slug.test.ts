import { expect, it, describe, beforeEach } from 'vitest'
import { InMemoryQuestionsRepository } from '@tests/in-memory-repository/questions'
import { GetQuestionBySlugUseCase } from './get-question-by-slug'
import { createQuestion } from '@tests/factory/question'
import { ResourceNotFoundError } from '@/core/errors'

let repository: InMemoryQuestionsRepository
let sut: GetQuestionBySlugUseCase

describe('Get Question by Slug Use Case', () => {
  beforeEach(() => {
    repository = new InMemoryQuestionsRepository()
    sut = new GetQuestionBySlugUseCase(repository)
  })

  it('it should get question by a slug if exists', async () => {
    const question = createQuestion()
    await repository.create(question)

    const res = await sut.execute({ slug: question.slug.value })

    expect(res.isSuccess()).toBe(true)

    if (!res.isSuccess()) return

    expect(res.value).toMatchObject({
      question: {
        title: question.title,
        slug: question.slug,
      },
    })
  })

  it('it should return ResourceNotFoundError if question does not exists', async () => {
    const res = await sut.execute({ slug: 'invalid-slug' })
    expect(res.isFailure()).toBe(true)
    expect(res.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
