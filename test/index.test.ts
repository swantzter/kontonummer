/* eslint-env mocha */
import Kontonummer from '../src/index'
import { strictEqual, throws } from 'assert'

describe('Kontonummer', () => {
  it('Should validate a Forex account', () => {
    const forex = new Kontonummer('9420, 417 23 85')

    strictEqual(forex.bankName, 'Forex Bank', 'Forex Bank bank account number returns correct bank name')
    strictEqual(forex.sortingCode, '9420', 'Forex Bank bank account number returns correct clearing number')
    strictEqual(forex.accountNumber, '4172385', 'Forex Bank bank account number returns correct account number')
  })

  it('Should validate a Handelsbanken account', () => {
    const handelsbanken = new Kontonummer('6789123456789')

    strictEqual(handelsbanken.bankName, 'Handelsbanken', 'Handelsbanken bank account number returns correct bank name')
    strictEqual(handelsbanken.sortingCode, '6789', 'Handelsbanken bank account number returns correct clearing number')
    strictEqual(handelsbanken.accountNumber, '123456789', 'Handelsbanken bank account number returns correct account number')
  })

  it('Should verify a Swedbank account number with a 5 digit sorting code', () => {
    const swedbank5 = new Kontonummer('8424-4,983 189 224-6')

    strictEqual(swedbank5.bankName, 'Swedbank', 'Swedbank bank account number with a five digit clearing number returns correct bank name')
    strictEqual(swedbank5.sortingCode, '84244', 'Swedbank bank account number with a five digit clearing number returns correct clearing number')
    strictEqual(swedbank5.accountNumber, '9831892246', 'Swedbank bank account number with a five digit clearing number returns correct account number')
  })

  it('Should veify an account number from Sparbanken Tanum', () => {
    const sparbankenTanum = new Kontonummer('8351-9,392 242 224-5')

    strictEqual(sparbankenTanum.bankName, 'Swedbank', 'Sparbanken Tanum bank account number returns correct bank name')
    strictEqual(sparbankenTanum.sortingCode, '83519', 'Sparbanken Tanum account number returns correct clearing number')
    strictEqual(sparbankenTanum.accountNumber, '3922422245', 'Sparbanken Tanum account number returns correct account number')
  })

  it('Should verify an account number from Sparbank i Hudiksvall', () => {
    const hudik = new Kontonummer('8129-9,043 386 711-6')

    strictEqual(hudik.bankName, 'Swedbank', 'Sparbank i Hudiksvall bank account number returns correct bank name')
    strictEqual(hudik.sortingCode, '81299', 'Sparbank i Hudiksvall account number returns correct clearing number')
    strictEqual(hudik.accountNumber, '0433867116', 'Sparbank i Hudiksvall account number returns correct account number')
  })

  it('Should verify a Nordea personkonto', () => {
    const nordeaPersonnumber = new Kontonummer('3300 000620-5124')

    strictEqual(nordeaPersonnumber.bankName, 'Nordea', 'Nordea personnumber bank account number returns correct bank name')
    strictEqual(nordeaPersonnumber.sortingCode, '3300', 'Nordea personnumber bank account number returns correct clearing number')
    strictEqual(nordeaPersonnumber.accountNumber, '0006205124', 'Nordea personnumber bank account number returns correct account number')
  })

  it.skip('Should verify a klarna account number', () => {
    const klarna = new Kontonummer('97891111113')

    strictEqual(klarna.bankName, 'Klarna Bank', 'Klarna Bank bank account number returns correct bank name')
    strictEqual(klarna.sortingCode, '9789', 'Klarna Bank bank account number returns correct clearing number')
    strictEqual(klarna.accountNumber, '1111113', 'Klarna Bank bank account number returns correct account number')
  })

  it('Should throw for an invalid account number', () => {
    throws(() => new Kontonummer('123456789'), {
      name: 'KontonummerError',
      message: 'Invalid account number'
    })
  })

  it('Should throw if the check digit is invaluid', () => {
    throws(() => new Kontonummer('6789123456788'), {
      name: 'KontonummerError',
      message: 'Invalid account number'
    })
  })

  it.skip('Should throw if the check digit on a 5 digit sorting code ins invalid', () => {
    // Same account number as 'swedbank5' above, but different clearing number
    throws(() => new Kontonummer('8424-1,983 189 224-6'), {
      name: 'KontonummerError',
      message: 'Invalid sorting code'
    })
  })
})
