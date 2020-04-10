/* eslint-env mocha */
import Kontonummer from '../src/index'
import { strictEqual } from 'assert'

describe('Kontonummer', () => {
  it('Should createa a new Kontonummer instance', () => {
    const konto = new Kontonummer(1111, 1111111)

    strictEqual(konto.sortingCode, '1111')
    strictEqual(konto.accountNumber, '1111111')
  })
})
