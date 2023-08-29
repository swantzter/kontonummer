/* eslint-env mocha */
import format, { formatter } from '../src/format.js'
import { strictEqual } from 'node:assert'

describe('formatter', () => {
  const tests: Array<[string, string, string, boolean, string]> = [
    ['1111', '1122233', 'SSSS AA AAA AA', true, '1111 11 222 33'],
    ['1111', '122233', 'SSSS AA AAA AA', true, '1111 01 222 33'],
    ['1111', '122233', 'SSSS AA AAA AA', false, '1111 1 222 33'],
    ['1111', '22233', 'SSSS AA AAA AA', true, '1111 00 222 33'],
    ['1111', '22233', 'SSSS AA AAA AA', false, '1111 222 33'],

    ['1111', '1122233', 'SSSS-AA-AAAAA', false, '1111-11-22233'],
    ['1111', '1122233', 'SSSS-AA-AAAAA', true, '1111-11-22233'],
    ['1111', '122233', 'SSSS-AA-AAAAA', false, '1111-1-22233'],
    ['1111', '122233', 'SSSS-AA-AAAAA', true, '1111-01-22233'],
    ['1111', '22233', 'SSSS-AA-AAAAA', false, '1111-22233'],
    ['1111', '22233', 'SSSS-AA-AAAAA', true, '1111-00-22233'],

    ['11111', '1112223334', 'SSSS-S, AAA AAA AAA-A', false, '1111-1, 111 222 333-4'],
    ['11111', '2223334', 'SSSS-S, AAA AAA AAA-A', false, '1111-1, 222 333-4'],
    ['11111', '3334', 'SSSS-S, AAA AAA AAA-A', false, '1111-1, 333-4'],
    ['11111', '4', 'SSSS-S, AAA AAA AAA-A', false, '1111-1, 4'],
    ['11111', '4', 'SSSS-S, AAA AAA AAA-A', false, '1111-1, 4'],

    ['1111', '111222333', 'SSSS, AAA AAA AAA', false, '1111, 111 222 333'],
    ['1111', '11222333', 'SSSS, AAA AAA AAA', false, '1111, 11 222 333'],

    ['1111', '1122334444', 'SSSS, AAAAAA-AAAA', false, '1111, 112233-4444'],

    ['1111', '123456', 'SSSS, A-A', false, '1111, 12345-6']
  ]

  for (const [sortingCode, accountNumber, mask, pad, expected] of tests) {
    it(`Should format "${sortingCode}", "${accountNumber}" to "${expected}"`, () => {
      const formatted = formatter(sortingCode, accountNumber, mask, pad)

      strictEqual(formatted, expected)
    })
  }
})

describe('format', () => {
  it('Should format numerically', () => {
    const formatted = format(1111, '1234567', {
      bankName: 'Avanza Bank',
      type: 1,
      comment: 2,
      ranges: [[9550, 9569]]
    })

    strictEqual(formatted, '11111234567')
  })

  it('Should format numerically and pad', () => {
    const formatted = format('1111', 34567, {
      bankName: 'Avanza Bank',
      type: 1,
      comment: 2,
      ranges: [[9550, 9569]]
    })

    strictEqual(formatted, '11110034567')
  })

  it('Should format 5-digit clearing number numerically', () => {
    const formatted = format('11111', '1234567', {
      bankName: 'Avanza Bank',
      type: 1,
      comment: 2,
      ranges: [[9550, 9569]]
    })

    strictEqual(formatted, '111111234567')
  })

  it('Should pretty format Swedbank type 1', () => {
    const formatted = format('1111', '1234567', {
      bankName: 'Swedbank',
      type: 1,
      comment: 2,
      ranges: [[9550, 9569]]
    }, 'pretty')

    strictEqual(formatted, '1111-12-34567')
  })

  it('Should pretty format type 1', () => {
    const formatted = format('1111', '1234567', {
      bankName: 'Danske Bank',
      type: 1,
      comment: 2,
      ranges: [[9550, 9569]]
    }, 'pretty')

    strictEqual(formatted, '1111 12 345 67')
  })

  it('Should format Swedbank type 2 with 5 digit', () => {
    const formatted = format('11111', '1234567890', {
      bankName: 'Swedbank',
      type: 2,
      comment: 2,
      ranges: [[9550, 9569]]
    }, 'pretty')

    strictEqual(formatted, '1111-1, 123 456 789-0')
  })

  it('Should format Handelsbanken type 2', () => {
    const formatted = format('1111', '123456789', {
      bankName: 'Handelsbanken',
      type: 2,
      comment: 2,
      ranges: [[9550, 9569]]
    }, 'pretty')

    strictEqual(formatted, '1111, 123 456 789')
  })

  it('Should format Handelsbanken type 2 with short number', () => {
    const formatted = format('1111', '23456789', {
      bankName: 'Handelsbanken',
      type: 2,
      comment: 2,
      ranges: [[9550, 9569]]
    }, 'pretty')

    strictEqual(formatted, '1111, 23 456 789')
  })

  it('Should format short Nordea PlusGirot', () => {
    const formatted = format('1111', '12', {
      bankName: 'Nordea Plusgirot',
      type: 2,
      comment: 2,
      ranges: [[9550, 9569]]
    }, 'pretty')

    strictEqual(formatted, '1111, 1-2')
  })

  it('Should format medium Nordea PlusGirot', () => {
    const formatted = format('1111', '1234', {
      bankName: 'Nordea Plusgirot',
      type: 2,
      comment: 2,
      ranges: [[9550, 9569]]
    }, 'pretty')

    strictEqual(formatted, '1111, 1 23-4')
  })

  it('Should format long Nordea PlusGirot', () => {
    const formatted = format('1111', '12345678', {
      bankName: 'Nordea Plusgirot',
      type: 2,
      comment: 2,
      ranges: [[9550, 9569]]
    }, 'pretty')

    strictEqual(formatted, '1111, 123 45 67-8')
  })

  it('Should format other type 2', () => {
    const formatted = format('1111', '1234567890', {
      bankName: 'Danske Bank',
      type: 2,
      comment: 2,
      ranges: [[9550, 9569]]
    }, 'pretty')

    strictEqual(formatted, '1111, 12 3456 7890')
  })
})
