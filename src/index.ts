import getBank, { BankName } from '../lib/banks'
import parse from '../lib/parse'
import validate from '../lib/validate'

interface Options {
  mode: 'strict' | 'lax'
}

export default class Kontonummer {
  #bank: BankName
  #account: string
  #clearing: string

  get bank() { return this.#bank }
  get account() { return this.#account }
  get clearing() { return this.#clearing }

  constructor(clearingWithOrWithoutAccount: number | string, accountOrOptions?: number | string, options?: Options) {
    let clearing: string
    clearingWithOrWithoutAccount = `${clearingWithOrWithoutAccount}`.replace(/\D/g, '')
    account = account ? `${account}`.replace(/\D/g, '') : undefined

    const bank = getBank(clearingWithOrWithoutAccount, account)

    if (!account) {
      const parsed = parse(clearingWithOrWithoutAccount, bank.type, bank.comment)
      clearing = parsed.clearing
      account = parsed.account
    }

    if (!bank.validate(clearing, account)) {
      throw new KontonummerError()
    }

    this.#bank = bank.name
    this.#clearing = clearingWithOrWithoutAccount
    this.#account = account
  }
}
