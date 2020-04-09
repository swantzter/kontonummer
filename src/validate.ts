import { BankInfo } from "./banks"

export type validateFunction = (clearing: string, account: string) => boolean
type modFunction = (number: string | number) => boolean

export const mod10: modFunction = (number) => {

  number = `${number}`

  let len = number.length
  let bit = 1
  let sum = 0
  let val: number
  let arr = [0, 2, 4, 6, 8, 1, 3, 5, 7, 9]

  while (len) {
    val = parseInt(number.charAt(--len), 10)
    sum += (bit ^= 1) ? arr[val] : val
  }

  return sum && sum % 10 === 0
}

export const mod11: modFunction = (number) => {
  number = `${number}`

  let len = number.length
  let sum = 0
  let val: number
  let weights = [1, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1]
  let arr = weights.splice(weights.length - len, weights.length - (weights.length - len))

  while (len) {
    val = parseInt(number.charAt(--len), 10)
    sum += arr[len] * val
  }

  return sum && sum % 11 === 0
}

export default (type: BankInfo['type'], comment: BankInfo['comment']): validateFunction => (clearing, account) => {
  return type === 1 && comment === 1 ? mod11((clearing + account).substr(-10)) :
    type === 1 && comment === 2 ? mod11((clearing + account)) :
      type === 2 && comment === 2 ? mod11(account) :
        mod10(account) && (clearing.charAt(0) === "8" ? mod10(clearing) : true)
}
