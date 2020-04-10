// TODO: investigate https://www.dbschenker.com/se-sv/haer-ser-du-hur-kontonumret-ska-skrivas-foer-olika-banker-481736

export type SortingCodeInfo = Type1Account | Type2Account

interface SortingCodeBase {
  bankName: BankName
  ranges: Array<[number, number]> // [min, max] inclusive ranges
}

interface Type1Account extends SortingCodeBase {
  type: 1
  comment: 1 | 2
}

interface Type2Account extends SortingCodeBase {
  type: 2
  comment: 1 | 2 | 3
  accountMinLength?: number
  accountMaxLength?: number
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

export const banks: SortingCodeInfo[] = [
  // Type 1 accounts. Always 11 digits long sortingCode included.
  // SSSSAAAAAAC
  {
    bankName: 'Avanza Bank',
    type: 1,
    comment: 2,
    ranges: [[9550, 9569]]
  },
  {
    bankName: 'BlueStep Finans',
    type: 1,
    comment: 1,
    ranges: [[9680, 9689]]
  },
  {
    bankName: 'BNP Paribas SA.',
    type: 1,
    comment: 2,
    ranges: [[9470, 9479]]
  },
  {
    bankName: 'Citibank',
    type: 1,
    comment: 2,
    ranges: [[9040, 9049]]
  },
  {
    bankName: 'Danske Bank',
    type: 1,
    comment: 1,
    ranges: [[1200, 1399], [2400, 2499]]
  },
  {
    bankName: 'DNB Bank',
    type: 1,
    comment: 2,
    ranges: [[9190, 9199], [9260, 9269]]
  },
  {
    bankName: 'Ekobanken',
    type: 1,
    comment: 2,
    ranges: [[9700, 9709]]
  },
  {
    bankName: 'Erik Penser',
    type: 1,
    comment: 2,
    ranges: [[9590, 9599]]
  },
  {
    bankName: 'Forex Bank',
    type: 1,
    comment: 1,
    ranges: [[9400, 9449]]
  },
  {
    bankName: 'ICA Banken',
    type: 1,
    comment: 1,
    ranges: [[9270, 9279]]
  },
  {
    bankName: 'IKANO Bank',
    type: 1,
    comment: 1,
    ranges: [[9170, 9179]]
  },
  {
    bankName: 'JAK Medlemsbank',
    type: 1,
    comment: 2,
    ranges: [[9670, 9679]]
  },
  {
    bankName: 'Klarna Bank',
    type: 1,
    comment: 2,
    ranges: [[9780, 9789]]
  },
  {
    bankName: 'Landshypotek',
    type: 1,
    comment: 2,
    ranges: [[9390, 9399]]
  },
  {
    bankName: 'Lån & Spar Bank Sverige',
    type: 1,
    comment: 1,
    ranges: [[9630, 9639]]
  },
  {
    bankName: 'Länsförsäkringar Bank',
    type: 1,
    comment: 1,
    ranges: [[3400, 3499], [9060, 9069]]
  },
  {
    bankName: 'Länsförsäkringar Bank',
    type: 1,
    comment: 2,
    ranges: [[9020, 9029]]
  },
  {
    bankName: 'Marginalen Bank',
    type: 1,
    comment: 1,
    ranges: [[9230, 9239]]
  },
  {
    bankName: 'MedMera Bank',
    type: 1,
    comment: 2,
    ranges: [[9650, 9659]]
  },
  {
    bankName: 'Nordax Bank',
    type: 1,
    comment: 2,
    ranges: [[9640, 9649]]
  },
  {
    bankName: 'Nordea',
    type: 1,
    comment: 1,
    ranges: [[1100, 1199], [1400, 2099], [3000, 3299], [3301, 3399], [3410, 3781], [3783, 3999]]
  },
  {
    bankName: 'Nordea',
    type: 1,
    comment: 2,
    ranges: [[4000, 4999]]
  },
  {
    bankName: 'Nordnet Bank',
    type: 1,
    comment: 2,
    ranges: [[9100, 9109]]
  },
  {
    bankName: 'Resurs Bank',
    type: 1,
    comment: 1,
    ranges: [[9280, 9289]]
  },
  {
    bankName: 'Riksgälden',
    type: 1,
    comment: 2,
    ranges: [[9880, 9889]]
  },
  {
    bankName: 'Santander Consumer Bank',
    type: 1,
    comment: 1,
    ranges: [[9460, 9469]]
  },
  {
    bankName: 'SBAB',
    type: 1,
    comment: 1,
    ranges: [[9250, 9259]]
  },
  {
    bankName: 'SEB',
    type: 1,
    comment: 1,
    ranges: [[5000, 5999], [9120, 9124], [9130, 9149]]
  },
  {
    bankName: 'Skandiabanken',
    type: 1,
    comment: 2,
    ranges: [[9150, 9169]]
  },
  {
    bankName: 'Svea Bank',
    type: 1,
    comment: 2,
    ranges: [[9660, 9669]]
  },
  {
    bankName: 'Swedbank',
    type: 1,
    comment: 1,
    ranges: [[7000, 7999]]
  },
  {
    bankName: 'Ålandsbanken',
    type: 1,
    comment: 2,
    ranges: [[2300, 2399]]
  },

  // Type 2 accounts - the messy ones
  {
    bankName: 'Danske Bank',
    type: 2,
    comment: 1,
    ranges: [[9180, 9189]],
    accountMinLength: 10,
    accountMaxLength: 10
  },
  {
    bankName: 'Handelsbanken',
    type: 2,
    comment: 2,
    ranges: [[6000, 6999]],
    accountMinLength: 9, // TODO: Check this, I have an account number from SHB that's 8 digits
    accountMaxLength: 9
  },
  {
    bankName: 'Nordea',
    type: 2,
    comment: 1,
    ranges: [[3300, 3300], [3782, 3782]],
    accountMinLength: 10,
    accountMaxLength: 10
  },
  {
    // TODO: verify length
    // 2-8 digits source: https://www.samlogic.com/blogg/2012/11/kontroll-validering-av-bankgironummer-och-plusgironummer/
    bankName: 'Nordea Plusgirot',
    type: 2,
    comment: 3,
    ranges: [[9500, 9549], [9960, 9969]],
    accountMinLength: 2,
    accountMaxLength: 8
  },
  {
    bankName: 'Riksgälden',
    type: 2,
    comment: 1,
    ranges: [[9890, 9899]],
    accountMinLength: 10,
    accountMaxLength: 10
  },
  {
    bankName: 'Sparbanken Syd',
    type: 2,
    comment: 1,
    ranges: [[9570, 9579]],
    accountMinLength: 10,
    accountMaxLength: 10
  },
  {
    bankName: 'Swedbank',
    type: 2,
    comment: 3,
    ranges: [[8000, 8999], [80000, 89999]], // adding an extra 5-digit case to catch their 5 digit sorting codes
    // regex: /^8[0-9]{10,14}$/
    accountMinLength: 10, // source: https://www.swedbank.se/privat/kort-och-betala/konton-for-in-och-utbetalningar/clearingnummer.html
    accountMaxLength: 11 // Allowing 11 here in case clearingnumber is sent as the first four instead of the first five
  },
  {
    bankName: 'Swedbank',
    type: 2,
    comment: 1,
    ranges: [[9300, 9349]],
    accountMinLength: 10,
    accountMaxLength: 10
  }
]

export default (sortingCode: string | number): SortingCodeInfo | undefined =>
  banks.find(
    bank =>
      bank.ranges.some(
        ([min, max]) =>
          Number(sortingCode) >= min &&
          Number(sortingCode) <= max
      ))
