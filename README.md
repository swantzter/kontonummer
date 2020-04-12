# Kontonummer

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
![qa](https://github.com/svbeon/kontonummer/workflows/qa/badge.svg)
![release](https://github.com/svbeon/kontonummer/workflows/release/badge.svg)
[![codecov](https://codecov.io/gh/svbeon/kontonummer/branch/master/graph/badge.svg)](https://codecov.io/gh/svbeon/kontonummer)

This is a reimagination of [jop-io/kontonummer.js](https://github.com/jop-io/kontonummer.js)
with some additional goals:

- Provide an npm package with cjs and esm modules for easy use with node and
  bundlers.
- Provide TypeScript definitions
- Provide a similar API to [Personnummer](https://personnummer.dev)
- Stretch goal: Calculate IBAN (and BIC/SWIFT-code)
- Stretch goal: Handle BankGirot and PlusGirot numbers

Some Code (c) [Jonas Persson](https://github.com/jop-io) and
[Tobbe Lundberg](https://github.com/Tobbe) which they have gracefully released
under a MIT license. See [LICENCE](/svbeon/kontonummer/blob/master/LICENSE)

This implementation is written in TypeScript but the following specification
should be applicable to other languages as well. But some language specific
modifications may be required.

## Important Caveat

As explained in the [research](#research) section below there are some bank
account numbers that is impossible to validate (as they do not have a check
digit) that are indistinguishable from validatable accounts. I recommend using
this library on form input fields but do not prevent form submission if the
account number is reported as invalid. A good idea would be something like a
warning saying "there is a chance this is not a valid bank account number
you may want to double check."

## Specification [v1]

### Class

The package should include a class that which should be the return value of `parse`

```typescript
class Kontonummer {
  constructor (sortingCode: string | number, accountNumber: string | number, options?: InitOptions)
  constructor (sortingCodeAndAccountNumber: string | number, options?: InitOptions)
}
```

- `sortingCode` (sv. clearing nummer) should be one of the following formats
  - `SSSS`
  - `SSSS-C`
- `accountNumber` the allowed length varies, further explained in section
  [Account Number](#account-number)
  White-space should be allowed in any position. Basically, only characters
  matches the regex `/\d/` should be taken into consideration all other
  characters should be discarded.
- `sortingCodeAndAccountNumber` should be one of the following formats
  (where `S` is sorting code, `A` is account number and `C` is a check digit.
  White-space should be allowed in any position. Basically, only characters
  matches the regex `/\d/` should be taken into consideration all other
  characters should be discarded.
  - `SSSS,AC`
  - `SSSSAC`
  - `S-C,AC`
  - `S-CAC`
  - `S-C,A-C`
  - `S-CA-C`
  - etc.

### `InitOptions`

- `mode: 'strict' | 'semi' | 'lax'`
  - `strict` should validate sorting code, account number length and account
    number check digit. Should throw if any of these checks fail.
  - `semi` should do strict checks for type 1 account numbers (4+7) but lax
    checks for type 2 account numbers.
  - `lax` should not throw if the check digit of the account number cannot be
    validated. Should instead set the `valid` property to false if the check
    digit or length is invalid. Should still throw for invalid sorting codes.

### Properties

The class should expose the following properties once initialised

```typescript
class Kontonummer {
  readonly bankName: string
  readonly sortingCode: string
  readonly accountNumber: string
  readonly type: 1 | 2
  readonly comment: 1 | 2 | 3
  readonly valid: boolean // only relevant in `lax` mode
}
```

### Errors

All methods except for `validate` should throw an exception or return an error
as a second return value. Error handling may be different depending on language.
The exception/error class should be prefixed with `Kontonummer`.

### Parse

The class should include a static `parse` method that creates a new instance of
the class. It should take the same arguments as the class constructor. This
function should also be an exported standalone method of the package.

Pseudocode:

```typescript
class Kontonummer {
  static parse (...args) {
    return new Kontonummer(...args)
  }
}

export const parse = Kontonummer.parse
```

### Validate

The class should include a static `validate` method that attempts to parse the
provided input and returns a boolean that indicates if it succeeded. `validate`
should not accept any options. This function should also be an exported
standalone method of the package.

Pseudocode:

```typescript
class Kontonummer {
  validate (sortingCode, accountNumber)
  validate (sortingCodeAndAccountNumber) {
    try {
      new Kontonummer(sortingCode, accountNumber)
      return true
    } catch {
      return false
    }
  }
}

export const validate = Kontonummer.validate
```

### Format

Format key:
- `S`: Sorting Code
- `A`: Account number
- `C`: Check digit
- `K`: IBAN check digit
- `B`: IBAN bank code

The class should include a public `format` method that returns the sortingCode
and accountNumber in one string. Some different formats should be available.
If no argument is provided it should default to `numeric`.

```typescript
type Format = 'numeric' | 'separated' | 'separated-check' | 'grouped'

class Kontonummer {
  format (format?: Format): string
}
```

| Name | Format |
| ---- | ---- |
| **numeric** <br/> _(default)_ | `S[C]AC` |
| magic | Depends on type and bank, see [research](#research) below |

<!-- | separated | `S[C],AC` |
| separated-check | `S[-C],A-C` |
| grouped | TBD | -->

`[]` brackets marks optional

## [Research](https://i.imgur.com/5wuurYD.png)

### Sorting Code

Sorting codes are 4 digits long. (`SSSS`) However accounts in Swedbank that have
a sorting code starting with 8 displays an extra 5'th check digit to the sorting
code. (`SSSS-C`) The check digit is calculated using the mod-10 algorithm
[[7]](#source-7), [[citation-needed]]() This means that in actual bank
transactions the check digit is discarded for these accounts and only the first
four "actually matter". A sorting code needs to be a number between 1000 and 9999. [[3]](#source-3)

The sorting code can be used to derive the account type (1 or 2) and the associated "comment" in a publication by Bankgirot. [[1]](#source-1)

### Account Number

#### Type 1

Type 1 accounts are the "standard" for swedish bank accounts. Swedish bankers' association are "actively working for increased standardisation on the Swedish
market and only allows type 1 for new banks" [[9]](#source-9)

A type 1 account number is 11 digits long, (4 digits for the sorting code and 7
for the account number) the sorting code and check digit is part of the account
number. [[1]](#source-1) The format is `SSSSAAAAAAC`, or with separation for
readability `SSSS AA AAA AC`. [[5]](#source-5), [[9]](#source-9)
Swedbank formats their type 1 account numbers in a different way `SSSS-AA-AAAAC`
[[10]](#source-10)

The check digit is calculated using a mod-11 algorithm which is either
calculated on the whole sorting code and account number (`SSSSAAAAAA`) or, the
last three digits of the sorting code and the whole account number
(`SSSAAAAAA`) this varies by clearing number range and is referred to by
"comment" in the documents from Bankgirot. [[1]](#source-1), [[8]](#source-8)
Why does this differ? I have no idea!

#### Type 2

Type 2 accounts are the wild west of bank accounts. This is where you should go
if you seek chaos.

Type 2 accounts are the older account type and the sorting code is not part
of the account number. This means that the sorting code is often only required
for external transactions, i.e. to another bank than the account holder's.
These accounts are mainly used by Handelsbanken, Nordea, Swedbank, and the
independent savings banks. [[9]](#source-9)

Type 2 account numbers are between 5 and 11 digits long without the sorting code
[[9]](#source-9), or 2-11 digits long if PlusGirot numbers are counted.
[[1]](#source-1) Worthy of note however is that PlusGirot "transaction accounts"
are 10 digits long. This is mainly a different way of writing a PlusGirot
account number. [[6]](#source-6)

Some notable examples follow, for a full list see Bankgirot. [[1]](#source-1)

##### Swedbank and the independent savings banks

Accounts with Swedbank and all the independent savings banks that have a sorting
code starting with 8 are type 2 accounts. The sorting code is not part of the
account number. As mentioned above, a 5'th digit is added to the sorting code
for these Swedbank and independent savings banks' bank accounts to
account for that. The account number (check digit included) is 10 digits long.
[[1]](#source-1) [[10]](#source-10)

The format for these account numbers is `AAAAAAAAAC`, or with separation
for readability `AAA AAA AAA-C` when showing the sorting code
in the latter format it is separated from the account number by a comma by
Swedbank `SSSS-C, AAA AAA AAA-C`. [[10]](#source-10)

The check digit are calculated using a mod-10 algorithm on the whole account
number `AAAAAAAAA`. [[1]](#source-1)

**!!NOTE!!** There exist very old Swedbank accounts without any check digit.
There is no way to validate these account numbers. [[1]](#source-1)
As far as I've been able to find out these accounts also "lives" under the same
sorting codes as other accounts with a check digit, so there is no way to
distinguish them. [[citation-needed]]()

##### Handelsbanken

Accounts with Handelsbanken are 9 digits long according to Bankgirot.
[[1]](#source-1) However, in some instances, notably bushiness accounts the
account number might be shorter (I personally have examples with 8 digits)
[[citation-needed]]()

The format for these account numbers are `AAAAAAAAC`, or with separation
for readability `AAA AAA AAC`. As the sorting code is not part of the
account number and not part of the check digit calculation. Account numbers that
are shorter than 9 digits do not _need_ to be zero-padded because the sorting
code is not part of the account number and should be entered separately,
so `AA AAA AAC` is valid.
The sorting code is separated from the account number using a dash in their
mobile applications `SSSS - AAA AAA AAC`, but it seems reasonable to use a comma
like Swedbank to separate sorting code and account number. [[citation-needed]]()

The check digit are calculated using a mod-11 algorithm on the whole account
number `AAAAAAAA`. [[1]](#source-1)

##### Nordea Personkonto

These accounts have the holders personal identity number as their account
number. They are 10 digits long. Traditionally these account numbers are written
without their sorting code, but in actuality they have the sorting code 3300.
[[1]](#source-1), [[11]](#source-11)

No new Nordea Personkonto with the holders personal identity number as the
account number are issued as of 2019-01-01. [[11]](#source-11)

The format for these account numbers are `AAAAAAAAAC`. [[1]](#source-1)
It stands to reason that the format with separation for readability is the same as for a personal identity number `AAAAAA-AAAC` but do note that only digits
are significant in bank account numbers so the dash (or plus for people older
than 100) cannot be used to differentiate bank accounts which may men there
is a risk for collisions. [[citation-needed]]()

The check digit are calculated using a mod-10 algorithm on the whole account
number `AAAAAAAAA`. [[1]](#source-1) Same as for personal identity numbers.
[[12]](#source-12)

##### Nordea PlusGirot Account

TODO. There are some decisions to be made regarding this.
Should the 2-8 digit format be allowed for validation or only the 10 digit
longer form. this depends on Bankgirot implementation I think.
Currently the 2-8 digit numbers do validate and the 10 digit ones do not.

##### Others

The other type 2 accounts are 10 digits long. [[1]](#source-1)

The format for these account numbers are `AAAAAAAAAC`. [[1]](#source-1)
The format with separation for readability is not known at the time of writing
[[citation-needed]]()

The check digit are calculated using a mod-10 algorithm on the whole account
number `AAAAAAAAA`. [[1]](#source-1)

### BankGirot and PlusGirot

Bankgirot is just an "address" to an actual account number whereas PlusGirot
(formerly PostGirot) is an actual account.

TODO How to handle these? should there be a separate `Kontonummer.BgPg` class
with a different API? Open for suggestions.

#### PlusGirot

The format for these are `AAAAAAAC`, or with separation for readability
`AAA AA AA-C`. [[6]](#source-6) omit digits from the left if the number is
shorter.

The check digit are calculated using a mod-10 algorithm on the whole account
number `AAAAAAA`. [[1]](#source-1)

#### Bankgirot

The format for these are `AAAAAAAC` or `AAAAAAC`, or with separation for
readability `AAAA-AAAC` / `AAA-AAAC`. [[7]](#source-6)

The check digit are calculated using a mod-10 algorithm on the whole
number `AAAAAAA`. [[7]](#source-7)

### BIC (SWIFT) and IBAN

TODO: research + implement.

Im imagining a `readonly bic: string`property and a `.format('iban')`.

Swedish IBAN numbers are 24 digits long and has the format
`[SE]KK BBBA AAAA AAAA AAAA AAAA`
(letters wrapped in `[]` are "escaped" i.e static and not a placeholder) [[4]](#source-4)

The bank codes and BIC codes are assigned by the swedish bankers' association.
[[2]](#source-2)

The check digits are calculated using a mod-97 algorithm. [[4]](#source-4)

## Needs further research

1. <https://www.dbschenker.com/se-sv/haer-ser-du-hur-kontonumret-ska-skrivas-foer-olika-banker-481736>
Claims about Danske Bank
2. PlusGirot vs PlusGirot Account (2-8 vs 14 digits)
3. BIC/IBAN

## Sources

1. <a id="source-1"></a>
  Bankgirot. (2019-10-22).
  _Bankernas kontonummer_.
  Stockholm: Bankgirocentralen BGC AB.
  [[pdf]](https://www.bankgirot.se/globalassets/dokument/anvandarmanualer/bankernaskontonummeruppbyggnad_anvandarmanual_sv.pdf),
  [[archived]](https://web.archive.org/web/20200412104139/https://www.bankgirot.se/globalassets/dokument/anvandarmanualer/bankernaskontonummeruppbyggnad_anvandarmanual_sv.pdf),
  [index](https://www.bankgirot.se/kundservice/handbocker/)
2. <a id="source-2"></a>
  Svenska Bankföreningen. (2019-05-23).
  _Swedish Bank ID Codes for IBAN_.
  Stockholm: Svenska Bankföreningen
  [[pdf]](https://www.swedishbankers.se/media/4223/bank_id_iban_bic.pdf),
  [[archived]](web.archive.org/web/20200412105327/https://www.swedishbankers.se/media/4223/bank_id_iban_bic.pdf),
  [index](https://www.swedishbankers.se/fraagor-vi-arbetar-med/clearingnummer/clearingnummer/)
3. <a id="source-3"></a>
  Svenska Bankföreningen. (2019-06-12).
  _Förteckning över av Bankföreningen tilldelade och reserverade clearingnummerserier_.
  Stockholm: Svenska Bankföreningen.
  [[pdf]](https://www.swedishbankers.se/media/4245/1906_clearingnummer-institut.pdf),
  [[archived]](https://web.archive.org/web/20200412105642/https://www.swedishbankers.se/media/4245/1906_clearingnummer-institut.pdf),
  [index](https://www.swedishbankers.se/fraagor-vi-arbetar-med/clearingnummer/clearingnummer/)
4. <a id="source-4"></a>
  _International Bank Account Number_. (2020-04-11).
  Retrieved from Wikipedia:
  [[permalink]](https://en.wikipedia.org/w/index.php?title=International_Bank_Account_Number&oldid=950326275)
5. <a id="source-5"></a>
  _Bankkonto_. (2019-05-28).
  Retrieved from Wikipedia:
  [[permalink]](https://sv.wikipedia.org/w/index.php?title=Bankkonto&oldid=45788136)
6. <a id="source-6"></a>
  _Transaktionskonto med PlusGironummer_.
  Retrieved 2020-04-12 from Nordea:
  [[web]](https://www.nordea.se/foretag/produkter/betala/transaktionskonto.html),
  [[archived]](https://web.archive.org/web/20200412110937/https://www.nordea.se/foretag/produkter/betala/transaktionskonto.html)
7. <a id="source-7"></a>
  Bankgirot. (2016-12-01).
  _Beräkning av kontrollsiffra 10-modulen_.
  Stockholm: Bankgirocentralen BGC AB.
  [[pdf]](https://www.bankgirot.se/globalassets/dokument/anvandarmanualer/10-modul.pdf),
  [[archived]](https://web.archive.org/web/20200412111510/https://www.bankgirot.se/globalassets/dokument/anvandarmanualer/10-modul.pdf),
  [index](https://www.bankgirot.se/kundservice/handbocker/)
8. <a id="source-8"></a>
  Bankgirot. (2016-12-01).
  _Beräkning av kontrollsiffra 11-modulen_.
  Stockholm: Bankgirocentralen BGC AB.
  [[pdf]](https://www.bankgirot.se/globalassets/dokument/anvandarmanualer/11-modul.pdf),
  [[archived]](https://web.archive.org/web/20200412111804/https://www.bankgirot.se/globalassets/dokument/anvandarmanualer/11-modul.pdf),
  [index](https://www.bankgirot.se/kundservice/handbocker/)
9. <a id="source-9"></a>
  _Clearingnummer_. (2019-02-19).
  Retrieved 2020-04-12 from Svenska Bankföreningen:
  [[web]](https://www.swedishbankers.se/fraagor-vi-arbetar-med/clearingnummer/clearingnummer/),
  [[archived]](https://web.archive.org/web/20200412115826/https://www.swedishbankers.se/fraagor-vi-arbetar-med/clearingnummer/clearingnummer/)
10. <a id="source-10"></a>
  _Clearingnummer_.
  Retrieved 2020-04-12 from Swedbank:
  [[web]](https://www.swedbank.se/privat/kort-och-betala/konton-for-in-och-utbetalningar/clearingnummer.html),
  [[archived]](https://web.archive.org/web/20200412124754/https://www.swedbank.se/privat/kort-och-betala/konton-for-in-och-utbetalningar/clearingnummer.html)
11. <a id="source-11"></a>
  _Frågor och svar konton och clearingnummer_.
  Retrieved 2020-04-12 from Nordea:
  [[web]](https://www.nordea.se/privat/kundservice/fragor-svar-konton-clearingnummer.html),
  [[archived]](https://web.archive.org/web/20200412130818/https://www.nordea.se/privat/kundservice/fragor-svar-konton-clearingnummer.html)
12. <a id="source-12"></a>
  Statistiska centralbyrån. (2016).
  _Befolknings- och välfärdsstatistik 2016:1, Personnummer_.
  SCB, avdelningen för befolkning och välfärd.
  Örebro: Statistiska centralbyrån.
  urn:nbn:se:scb-2016-be96br1601_pdf,
  ISSN 1654-4331.
  [[pdf]](https://www.scb.se/contentassets/8d9d985ca9c84c6e8d879cc89a8ae479/ov9999_2016a01_br_be96br1601.pdf),
  [[archived]](https://web.archive.org/web/20200412133141/https://www.scb.se/contentassets/8d9d985ca9c84c6e8d879cc89a8ae479/ov9999_2016a01_br_be96br1601.pdf),
  [index](https://www.scb.se/hitta-statistik/statistik-efter-amne/ovrigt/ovrigt/ovriga-publikationer-ej-statistik/pong/publikationer/personnummer/)
