/* eslint-disable no-undef */
import { commands, getHelpStr } from '../src/command'
import {
  parseTimeStr,
  getNextSuggestedTime,
  getPassedTime
} from '../src/modules/time'

// ap::a[] -> a[] -> (a -> a -> b) -> b[]
const ap = <T, U>(xs: T[]) => (ys: T[]) => (f: (x: T, y: T) => U) => xs.flatMap(x => ys.map(y => f(x, y)))

// 文字列 -> 時間
test('str->time: 数字をコロンではさむ場合はその前後を時と分とする', () => {
  const hours = [...Array(100)].map((_, i) => i)
  const minutes = [...Array(100)].map((_, i) => i)

  const doPermutations = ap(hours)(minutes)
  doPermutations((h, m) => {
    const str = `${h}:${m}`
    const result = parseTimeStr(str)
    expect(result).toStrictEqual([h, m])
  })
})

test('str->tune: コロンを含まない場合はnullが返る', () => {
  expect(parseTimeStr('without_columns')).toBeNull()
  expect(parseTimeStr('12_34')).toBeNull()
})

test('str->tune: 数字以外をコロンではさむとnullが返る', () => {
  expect(parseTimeStr('string:sandwich')).toBeNull()
})

// at
test('at: その時間が過ぎていない場合は今日のその時間', () => {
  const result1 = getNextSuggestedTime(1, 1, new Date('1980/1/1 00:00'))
  expect(result1?.getTime()).toBe(new Date('1980/1/1 01:01').getTime())

  const result2 = getNextSuggestedTime(19, 0, new Date('1980/1/1 12:34'))
  expect(result2?.getTime()).toBe(new Date('1980/1/1 19:00').getTime())
})

test('at: その時間が過ぎているときは明日のその時間', () => {
  const result2 = getNextSuggestedTime(1, 0, new Date('1980/1/1 12:00'))
  expect(result2?.getTime()).toBe(new Date('1980/1/2 01:00').getTime())

  const result1 = getNextSuggestedTime(24, 0, new Date('1980/1/1 12:00'))
  expect(result1?.getTime()).toBe(new Date('1980/1/2 00:00').getTime())
})

test('at: NaNが入った場合', () => {
  const result1 = getNextSuggestedTime(NaN, 0, new Date('1980/1/1 00:00'))
  expect(result1).toBeNull()

  const result2 = getNextSuggestedTime(0, NaN, new Date('1980/1/1 00:00'))
  expect(result2).toBeNull()

  const result3 = getNextSuggestedTime(NaN, NaN, new Date('1980/1/1 00:00'))
  expect(result3).toBeNull()
})

// after
test('after: 日付をまたがない場合', () => {
  const result = getPassedTime(1, 1, new Date('1980/1/1 00:00'))
  expect(result?.getTime()).toBe(new Date('1980/1/1 01:01').getTime())
})

test('after: 日付をまたぐ場合', () => {
  const result1 = getPassedTime(12, 0, new Date('1980/1/1 12:00'))
  expect(result1?.getTime()).toBe(new Date('1980/1/2 0:00').getTime())

  const result2 = getPassedTime(24, 0, new Date('1980/1/1 00:00'))
  expect(result2?.getTime()).toBe(new Date('1980/1/2 0:00').getTime())
})

test('after: NaNが入った場合', () => {
  const result1 = getPassedTime(NaN, 0, new Date('1980/1/1 00:00'))
  expect(result1).toBeNull()

  const result2 = getPassedTime(0, NaN, new Date('1980/1/1 00:00'))
  expect(result2).toBeNull()

  const result3 = getPassedTime(NaN, NaN, new Date('1980/1/1 00:00'))
  expect(result3).toBeNull()
})

// コマンドヘルプ表示テスト
console.log(commands.map(getHelpStr))
