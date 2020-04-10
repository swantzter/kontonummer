import getSortingCodeInfo, { BankName, SortingCodeInfo } from './banks'
import { KontonummerError } from './errors'

interface InitOptions {
  mode: 'strict' | 'lax'
}

export default class Kontonummer {
  #bankName: BankName
  #sortingCode: string
  #accountNumber: string
  #type: 1 | 2
  #comment: 1 | 2 | 3
  #valid: boolean // only relevant in `lax` mode

  get bankName() { return this.#bankName }
  get sortingCode() { return this.#sortingCode }
  get accountNumber() { return this.#accountNumber }
  get type() { return this.#type }
  get comment() { return this.#comment }
  get valid() { return this.#valid }

  constructor(sortingCodeAndAccountNumber: string | number, options?: InitOptions)
  constructor(sortingCode: string | number, accountNumber: string | number, options?: InitOptions)
  constructor(sortingCodeWithOrWithoutAccountNumber: string | number, accountOrOptions?: string | number | InitOptions, optionsArg?: InitOptions) {
    let sortingCode: string
    let accountNumber: string
    let options: InitOptions = {
      mode: "strict"
    }

    // parse params
    // sortingCode
    sortingCodeWithOrWithoutAccountNumber = `${sortingCodeWithOrWithoutAccountNumber}`.replace(/[^\d]/g, '')
    sortingCode = sortingCodeWithOrWithoutAccountNumber.substring(0, sortingCodeWithOrWithoutAccountNumber.startsWith('8') ? 5 : 4) // Swedbank 8xxx-x have 5 digits

    // acoountNumber
    if (typeof accountOrOptions === 'object') {
      options = accountOrOptions
      accountNumber = sortingCodeWithOrWithoutAccountNumber.substring(sortingCodeWithOrWithoutAccountNumber.startsWith('8') ? 5 : 4)
    } else if (typeof accountOrOptions === 'string' || typeof accountOrOptions === 'number') {
      accountNumber = `${accountOrOptions}`.replace(/[^\d]/g, '')
    } else {
      accountNumber = sortingCodeWithOrWithoutAccountNumber.substring(sortingCodeWithOrWithoutAccountNumber.startsWith('8') ? 5 : 4)
    }

    // optionsArg
    if (typeof optionsArg === 'object') {
      options = optionsArg
    }

    // validate arguments
    if (sortingCode.length > 4) {
      throw new KontonummerError('Sorting code must be 4 or 5 digits long')
    }

    if (accountNumber.length < 2) {
      throw new KontonummerError('Invalid account number provided')
    }

    const bank = Kontonummer.getSortingCodeInfo(sortingCode)

    // TODO: validate

    this.#bankName = bank.bankName
    this.#type = bank.type
    this.#comment = bank.comment

    this.#sortingCode = sortingCode
    this.#accountNumber = accountNumber
    this.#valid = true
  }

  public static parse(sortingCodeAndAccountNumber: string | number, options?: InitOptions): Kontonummer
  public static parse(sortingCode: string | number, accountNumber: string | number, options?: InitOptions): Kontonummer
  public static parse(sortingCodeWithOrWithoutAccountNumber: string | number, accountOrOptions?: string | number | InitOptions, options?: InitOptions) {
    if (typeof accountOrOptions === 'string' || typeof accountOrOptions === 'number') return new Kontonummer(sortingCodeWithOrWithoutAccountNumber, accountOrOptions, options)
    else return new Kontonummer(sortingCodeWithOrWithoutAccountNumber, accountOrOptions)
  }

  public static valid(sortingCodeAndAccountNumber: string | number): boolean
  public static valid(sortingCode: string | number, accountNumber: string | number): boolean
  public static valid(sortingCodeWithOrWithoutAccountNumber: string | number, accountNumber?: string | number) {
    if (accountNumber && (typeof accountNumber !== 'string' || typeof accountNumber !== 'number')) throw new KontonummerError('Kontonummer.valid() does not accept an options argument')
    try {
      if (accountNumber) new Kontonummer(sortingCodeWithOrWithoutAccountNumber, accountNumber)
      else new Kontonummer(sortingCodeWithOrWithoutAccountNumber)
      return true
    } catch {
      return false
    }
  }

  public static getSortingCodeInfo(sortingCode: string | number): SortingCodeInfo {
    const bank = getSortingCodeInfo(sortingCode)
    if (typeof bank === 'undefined') throw new KontonummerError(`No Bank found with sorting code ${sortingCode}`)
    return bank
  }
}

export const parse = Kontonummer.parse
export const valid = Kontonummer.valid
