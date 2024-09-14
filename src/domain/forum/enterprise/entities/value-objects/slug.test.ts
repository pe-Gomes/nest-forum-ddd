import { expect, test } from 'vitest'
import { Slug } from './slug'

test('it should create a slug from a text', () => {
  const text = 'An example text'
  const slug = Slug.createFromText(text)
  expect(slug.value).toBe('an-example-text')
})
