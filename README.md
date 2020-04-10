# Kontonummer

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
![build](https://github.com/svbeon/kontonummer/workflows/build/badge.svg)

This is a reimagination of [jop-io/kontonummer.js](https://github.com/jop-io/kontonummer.js) with some additional goals:

- Provide an npm package with cjs and esm modules for easy use with node and bundlers.
- Provide TypeScript definitions
- Provide a similar API to [Personnummer](https://personnummer.dev)
- Stretch goal: Calculate IBAN (and BIC/SWIFT-code)

Some Code (c) [Jonas Persson](https://github.com/jop-io) and [Tobbe Lundberg](https://github.com/Tobbe) which they have gracefully released under a MIT license. See [LICENCE](/svbeon/kontonummer/blob/master/LICENSE)

This implementation is written in TypeScript but the following specification should be applicable to other languages as well. But some minor modifications may be required

## Specification [v1]

### Class

The package should include a class that which should be the return value of  `parse`

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
- `accountNumber` the allowed length varies, further explained in section [Account Number](#account-number)
- `sortingCodeAndAccountNumber` should be one of the following formats (where `S` is sorting code, `A` is account number and `C` is a check digit. White-space should be allowed in any position. basically, only what characters matches the regex `/\d/` should be taken into consideration.
  - `SSSS,AC`
  - `SSSSAC`
  - `S-C,AC`
  - `S-CAC`
  - `S-C,A-C`
  - `S-CA-C`
  - etc.

### `InitOptions`

- `mode: 'strict' | 'lax'`
  - If set to `lax` the constructor should not throw if given an `accountNumber` where the check digit can't be validated. This is to accommodate for some old account numbers that does not have a check digit (Swedbank  it should default to `strict`

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

All methods except for `valid` should throw an exception or return an error as a second return value. Error handling may be different depending on language. The exception/error class should be prefixed with `Kontonummer`. In general exceptions should be thrown if an invalid value is provided. There are some exceptions to this, notably the `lax` option

### Parse

The class should include a static `parse` method that creates a new instance of the class. It should take the same arguments as the class constructor.

Pseudocode:

```typescript
class Kontonummer {
  static parse (...args) {
    return new Kontonummer(...args)
  }
}
```

### Valid

The class should include a static `valid` method that attempts to parse the provided input and returns a boolean that indicates if it succeeded. Valid should not accept any options.

Pseudocode:

```typescript
class Kontonummer {
  valid (sortingCode, accountNumber)
  valid (sortingCodeAndAccountNumber) {
    try {
      new Kontonummer(sortingCode, accountNumber)
      return true
    } catch {
      return false
    }
  }
}
```

### Format

The class should include a public `format` method that returns the sortingCode and accountNumber in one string. Some different formats should be available. If no argument is provided it should default to `numeric`.

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
<!--stackedit_data:
eyJoaXN0b3J5IjpbLTE3OTM0NTkzNjIsLTExMjcxMDcxNSwxNz
E2NTA3ODUxXX0=
-->
