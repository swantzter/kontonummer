import type { SortingCodeInfo, Type2Account } from './banks'

export type Format = 'numeric' | 'pretty'

type FormatFn = (sortingCode: string, accountNumber: string, mask: string, pad?: boolean) => string

export const formatter: FormatFn = (sortingCode, accountNumber, mask, pad = false) => {
  // we need to split these because sortingCode goes ltr and accountNumber goes rtl
  const accountNumberMask = mask.substring(mask.lastIndexOf('S') + 1)
  const sortingCodeMask = mask.substring(0, mask.lastIndexOf('S') + 1)

  const sortingCodeResult: string[] = []
  const accountNumberResult: string[] = []

  const sortingCodeChars = sortingCode.split('')
  const accountNumberChars = accountNumber.split('')

  /*
   * Here's what will happen we'll go through the mask and replace every 'S' with the next
   * character in the sorting code. if there's no mask for that character we output the character
   * If there's no more characters we end the loop.
   */
  for (let idx = 0; idx < Math.max(sortingCodeMask.length, sortingCodeChars.length); idx++) {
    if (sortingCodeMask[idx] === 'S' || sortingCodeMask[idx] === undefined) {
      sortingCodeResult.push(sortingCodeChars.shift() ?? '')
    } else {
      sortingCodeResult.push(sortingCodeMask[idx])
    }

    if (sortingCodeChars.length === 0) break
  }

  /*
   * for the account number we do a similar thing to the sorting code, except that we start
   * from the right. Why? Because we might want to zero-pad the number based on the mask, and we
   * always want the zero padding to the left/the start of the number
   */
  for (let idx = accountNumberMask.length - 1; idx >= 0; idx--) {
    if (accountNumberMask[idx] === 'A') {
      accountNumberResult.unshift(accountNumberChars.pop() ?? (pad ? '0' : ''))
    } else {
      accountNumberResult.unshift(accountNumberMask[idx])
    }

    // if we have more account number than we have mask we just dump it at the start
    if (idx === accountNumberMask.indexOf('A') && accountNumberChars.length > 0) {
      while (accountNumberChars.length) {
        accountNumberResult.unshift(accountNumberChars.pop() ?? '')
      }
    }

    if (accountNumberChars.length === 0 && !pad) {
      accountNumberResult.unshift(...accountNumberMask.slice(0, accountNumberMask.indexOf('A')))
      break
    }
  }

  return `${sortingCodeResult.join('')}${accountNumberResult.join('')}`
}

export default (sortingCode: string | number, accountNumber: string | number, sortingCodeInfo: SortingCodeInfo, format: Format = 'numeric') => {
  sortingCode = `${sortingCode ?? ''}`
  accountNumber = `${accountNumber ?? ''}`

  const { bankName, type } = sortingCodeInfo

  if (format === 'pretty') {
    if (type === 1 && bankName === 'Swedbank') {
      return formatter(sortingCode, accountNumber, 'SSSS-AA-AAAAA', true)
    } else if (type === 1) {
      return formatter(sortingCode, accountNumber, 'SSSS AA AAA AA', true)
    } else if (bankName === 'Swedbank') {
      return formatter(sortingCode, accountNumber, 'SSSS-S, AAA AAA AAA-A')
    } else if (bankName === 'Handelsbanken') {
      return formatter(sortingCode, accountNumber, 'SSSS, AAA AAA AAA')
    } else if (bankName === 'Nordea Plusgirot') {
      return formatter(sortingCode, accountNumber, 'SSSS, AAA AA AA-A')
    } else {
      return formatter(sortingCode, accountNumber, 'SSSS-S, AA AAAA AAAA')
    }
  } else {
    return formatter(sortingCode, accountNumber, 'SSSSS' + new Array((sortingCodeInfo as Type2Account).accountMinLength ?? 7).fill('A').join(''), true)
  }
}
