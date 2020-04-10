export class KontonummerError extends Error {
  name = 'KontonummerError'
  constructor(msg?: string) {
    super(msg)
  }
}
