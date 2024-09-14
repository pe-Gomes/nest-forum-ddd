/**
 * Make some property optional on a given type.
 * @example Create a type with 'createdAt' and 'id' as optional.
 * ```typescript
 * type Post = {
 *  id: string
 *  title: string
 *  createdAt: Date
 * }
 *
 *  Optional<Post, 'id' | 'createdAt'>
 * ```
 */
export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>
