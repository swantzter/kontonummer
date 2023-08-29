/* eslint-env mocha */
import assert from 'node:assert'
import { KontonummerError } from '../src/errors.js'

describe('KontonummerError', () => {
  it('Should throw a named error', () => {
    assert.throws(() => { throw new KontonummerError() }, { name: 'KontonummerError' })
  })
})
