import { SortingCodeInfo } from './banks'
type modFunction = (number: string | number) => boolean

export const mod10: modFunction = (number) => {
  number = `${number}`

  let len = number.length
  let bit = 1
  let sum = 0
  let val: number
  const arr = [0, 2, 4, 6, 8, 1, 3, 5, 7, 9]

  while (len) {
    val = parseInt(number.charAt(--len), 10)
    bit ^= 1
    sum += bit ? arr[val] : val
  }

  return !!sum && sum % 10 === 0
}

export const mod11: modFunction = (number) => {
  number = `${number}`

  let len = number.length
  let sum = 0
  let val: number
  const weights = [1, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1]
  const arr = weights.splice(weights.length - len, weights.length - (weights.length - len))

  while (len) {
    val = parseInt(number.charAt(--len), 10)
    sum += arr[len] * val
  }

  return !!sum && sum % 11 === 0
}

export default (type: SortingCodeInfo['type'], comment: SortingCodeInfo['comment'], sortingCode: string, accountNumber: string) => {
  // 1:1 => mod11 on 3 last of clearing + whole account number
  if (type === 1 && comment === 1) return mod11(`${sortingCode.substring(1)}${accountNumber.padStart(7, '0')}`)
  // 1:2 => mod 11 on whole clearing + whole account number
  if (type === 1 && comment === 2) return mod11(`${sortingCode}${accountNumber.padStart(7, '0')}`)

  // 2:2 => mod11 on whole account number (SHB) 9 digits
  if (type === 2 && comment === 2) return mod11(`${accountNumber.padStart(9, '0')}`)
  // 2:1 & 2:3 => mod10 on whole account number
  return mod10(accountNumber.padStart(10, '0'))
}
