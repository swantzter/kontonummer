# Kontonummer

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
![build](https://github.com/svbeon/kontonummer/workflows/build/badge.svg)

This is a reimagination of [jop-io/kontonummer.js](https://github.com/jop-io/kontonummer.js)
with some additional goals:

- Provide an npm package with cjs and esm modules for easy use with node and
  bundlers.
- Provide TypeScript definitions
- Provide a similar API to [Personnummer](https://personnummer.dev)
- Stretch goal: Calculate IBAN (and BIC/SWIFT-code)

Some Code (c) [Jonas Persson](https://github.com/jop-io) and
[Tobbe Lundberg](https://github.com/Tobbe) which they have gracefully released
under a MIT license. See [LICENCE](/svbeon/kontonummer/blob/master/LICENSE)

This implementation is written in TypeScript but the following specification
should be applicable to other languages as well. But some language specific
modifications may be required.

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

The class should expose the folowing properties once initialised

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
| separated | `S[C],AC` |
| separated-check | `S[-C],A-C` |
| grouped | TBD|
brackets marks optional

## Formats (Types and "Comments")

### Sorting Code

### Account Number
