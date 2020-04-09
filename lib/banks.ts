import validateFactory, { validateFunction } from '../lib/validate'

export interface BankInfo {
  name: BankName
  type: 1 | 2
  comment: 1 | 2 | 3
  regex: RegExp
  validate: validateFunction
}

export type BankName =
  'Avanza Bank' | 'BlueStep Finans' | 'BNP Paribas SA.' | 'Citibank' |
  'Danske Bank' | 'DNB Bank' | 'Ekobanken' | 'Erik Penser' |
  'Forex Bank' | 'Handelsbanken' | 'ICA Banken' | 'IKANO Bank' |
  'JAK Medlemsbank' | 'Klarna Bank' | 'Lån & Spar Bank Sverige' | 'Landshypotek' |
  'Länsförsäkringar Bank' | 'Marginalen Bank' | 'MedMera Bank' | 'Nordax Bank' |
  'Nordea' | 'Nordea Plusgirot' | 'Nordnet Bank' | 'Resurs Bank' |
  'Riksgälden' | 'Santander Consumer Bank' | 'SBAB' | 'SEB' |
  'Skandiabanken' | 'Sparbanken Syd' | 'Svea Bank' | 'Swedbank' |
  'Ålandsbanken'

export const banks: BankInfo[] = [
  {
    name: 'Avanza Bank',
    type: 1,
    comment: 2,
    regex: /^95[5-6][0-9]{8}$/
  },
  {
    name: 'BlueStep Finans',
    type: 1,
    comment: 1,
    regex: /^968[0-9]{8}$/
  },
  {
    name: 'BNP Paribas SA.',
    type: 1,
    comment: 2,
    regex: /^947[0-9]{8}$/
  },
  {
    name: 'Citibank',
    type: 1,
    comment: 2,
    regex: /^904[0-9]{8}$/
  },
  {
    name: 'Danske Bank',
    type: 1,
    comment: 1,
    regex: /^(12|13|24)[0-9]{9}$/
  },
  {
    name: 'Danske Bank',
    type: 2,
    comment: 1,
    regex: /^918[0-9]{11}$/
  },
  {
    name: 'DNB Bank',
    type: 1,
    comment: 2,
    regex: /^(919|926)[0-9]{8}$/
  },
  {
    name: 'Ekobanken',
    type: 1,
    comment: 2,
    regex: /^970[0-9]{8}$/
  },
  {
    name: 'Erik Penser',
    type: 1,
    comment: 2,
    regex: /^959[0-9]{8}$/
  },
  {
    name: 'Forex Bank',
    type: 1,
    comment: 1,
    regex: /^94[0-4][0-9]{8}$/
  },
  {
    name: 'Handelsbanken',
    type: 2,
    comment: 2,
    regex: /^6[0-9]{12}$/
  },
  {
    name: 'ICA Banken',
    type: 1,
    comment: 1,
    regex: /^927[0-9]{8}$/
  },
  {
    name: 'IKANO Bank',
    type: 1,
    comment: 1,
    regex: /^917[0-9]{8}$/
  },
  {
    name: 'JAK Medlemsbank',
    type: 1,
    comment: 2,
    regex: /^967[0-9]{8}$/
  },
  {
    name: 'Klarna Bank',
    type: 1,
    comment: 2,
    regex: /^978[0-9]{8}$/
  },
  {
    name: 'Lån & Spar Bank Sverige',
    type: 1,
    comment: 1,
    regex: /^963[0-9]{8}$/
  },
  {
    name: 'Landshypotek',
    type: 1,
    comment: 2,
    regex: /^939[0-9]{8}$/
  },
  {
    name: 'Länsförsäkringar Bank',
    type: 1,
    comment: 1,
    regex: /^(340|906)[0-9]{8}$/
  },
  {
    name: 'Länsförsäkringar Bank',
    type: 1,
    comment: 2,
    regex: /^902[0-9]{8}$/
  },
  {
    name: 'Marginalen Bank',
    type: 1,
    comment: 1,
    regex: /^923[0-9]{8}$/
  },
  {
    name: 'MedMera Bank',
    type: 1,
    comment: 2,
    regex: /^965[0-9]{8}$/
  },
  {
    name: 'Nordax Bank',
    type: 1,
    comment: 2,
    regex: /^964[0-9]{8}$/
  },
  {
    name: 'Nordea',
    type: 1,
    comment: 1,
    regex: /^(?!3300|3782)(1[1456789][0-9]{2}|20[0-9]{2}|3[0-3][0-9]{2}|34[1-9][0-9]|3[5-9][0-9]{2})[0-9]{7}$/
  },
  {
    name: 'Nordea',
    type: 1,
    comment: 2,
    regex: /^4[0-9]{10}$/
  },
  {
    name: 'Nordea',
    type: 2,
    comment: 1,
    regex: /^(3300|3782)[0-9]{10}$/
  },
  {
    name: 'Nordea Plusgirot',
    type: 2,
    comment: 3,
    regex: /^(95[0-4]|996)[0-9]{8,11}$/
  },
  {
    name: 'Nordnet Bank',
    type: 1,
    comment: 2,
    regex: /^910[0-9]{8}$/
  },
  {
    name: 'Resurs Bank',
    type: 1,
    comment: 1,
    regex: /^928[0-9]{8}$/
  },
  {
    name: 'Riksgälden',
    type: 1,
    comment: 2,
    regex: /^988[0-9]{8}$/
  },
  {
    name: 'Riksgälden',
    type: 2,
    comment: 1,
    regex: /^989[0-9]{11}$/
  },
  {
    name: 'Santander Consumer Bank',
    type: 1,
    comment: 1,
    regex: /^946[0-9]{8}$/
  },
  {
    name: 'SBAB',
    type: 1,
    comment: 1,
    regex: /^925[0-9]{8}$/
  },
  {
    name: 'SEB',
    type: 1,
    comment: 1,
    regex: /^(5[0-9]{3}|912[0-4]|91[3-4][0-9])[0-9]{7}$/
  },
  {
    name: 'Skandiabanken',
    type: 1,
    comment: 2,
    regex: /^91[5-6][0-9]{8}$/
  },
  {
    name: 'Sparbanken Syd',
    type: 2,
    comment: 1,
    regex: /^957[0-9]{11}$/
  },
  {
    name: 'Svea Bank',
    type: 1,
    comment: 2,
    regex: /^966[0-9]{8}$/
  },
  {
    name: 'Swedbank',
    type: 1,
    comment: 1,
    regex: /^7[0-9]{10}$/
  },
  {
    name: 'Swedbank',
    type: 2,
    comment: 3,
    regex: /^8[0-9]{10,14}$/
  },
  {
    name: 'Swedbank',
    type: 2,
    comment: 1,
    regex: /^93[0-4][0-9]{11}$/
  },
  {
    name: 'Ålandsbanken',
    type: 1,
    comment: 2,
    regex: /^23[0-9]{9}$/
  }
].map((bank: Omit<BankInfo, 'validate'>): BankInfo => ({
  ...bank,
  validate: validateFactory(bank.type, bank.comment)
}))

export default (clearingWithOrWithoutAccount: string, account?: string): BankInfo => banks.find(bank => bank.regex.test(`${clearingWithOrWithoutAccount}${account ?? ''}`))
