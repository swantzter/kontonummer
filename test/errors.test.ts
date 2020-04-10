/* eslint-env mocha */
import assert from 'assert'
import { KontonummerError } from '../src/errors'

describe('KontonummerError', () => {
  it('Should throw a named error', () => {
    assert.throws(() => { throw new KontonummerError() }, { name: 'KontonummerError' })
  })
})
