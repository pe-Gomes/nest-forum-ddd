import { describe, expect, it } from 'vitest'
import { WatchedList } from './watched-list'

class NumberWatchedList extends WatchedList<number> {
  compareItems(a: number, b: number): boolean {
    return a === b
  }
}

describe('WatchedList', () => {
  it('should initialize with new items to the list', () => {
    const list = new NumberWatchedList([1, 2, 3])

    expect(list.currentItems).toHaveLength(3)
  })

  it('should add new items to the list', () => {
    const list = new NumberWatchedList([1, 2, 3])

    list.add(4)

    expect(list.currentItems).toHaveLength(4)
    expect(list.getNewItems()).toEqual([4])
  })

  it('should remove items from the list', () => {
    const list = new NumberWatchedList([1, 2, 3])
    list.remove(1)
    list.remove(2)

    expect(list.currentItems).toHaveLength(1)
    expect(list.getRemovedItems()).toEqual([1, 2])
  })

  it('should be able add an item after remove operation', () => {
    const list = new NumberWatchedList([1, 2, 3])
    list.remove(1)
    list.add(1)

    expect(list.currentItems).toHaveLength(3)
    expect(list.getRemovedItems()).toEqual([])
    expect(list.getNewItems()).toEqual([])
  })

  it('should be able remove an item after add operation', () => {
    const list = new NumberWatchedList([1, 2, 3])
    list.add(4)
    list.remove(4)

    expect(list.currentItems).toHaveLength(3)
    expect(list.getRemovedItems()).toEqual([])
    expect(list.getNewItems()).toEqual([])
  })

  it('should be able to update list', () => {
    const list = new NumberWatchedList([1, 2, 3])

    list.update([1, 3, 5])

    expect(list.currentItems).toHaveLength(3)
    expect(list.getRemovedItems()).toEqual([2])
    expect(list.getNewItems()).toEqual([5])
  })
})
