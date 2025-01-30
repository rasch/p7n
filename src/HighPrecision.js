/**
 * @param {number} precision
 * @param {bigint} n
 */
const insertDecimal = (precision, n) => {
  const c = n.toString()

  if (precision === 0) {
    return c
  }

  const i = c.slice(0, -precision) || 0
  const d = c.slice(-precision).padEnd(precision, "0")

  return `${i}.${d}`
}

/**
 * @param {number} precision
 */
export const HighPrecision = precision => {
  if (precision < 0 || Math.floor(precision) !== precision) {
    throw new Error("Error: precision must be a positive integer")
  }

  return class HighPrecisionNumber {
    #n

    /**
     * @param {string} value
     */
    constructor(value) {
      const [integer, decimal] = value.split(".")
      const sign = integer?.startsWith("-") ? -1n : 1n

      const rounded =
        decimal && decimal.length > precision
          ? (
              BigInt(decimal.slice(0, precision)) +
              BigInt(Number(decimal[precision]) < 5 ? 0 : 1)
            )
          : BigInt((decimal ?? "").padEnd(precision, "0"))

      this.#n =
        BigInt(integer ?? 0) *
        10n ** BigInt(precision) +
        sign * rounded
    }

    /**
     * equals :: Setoid a => a ~> a -> Boolean
     * @param {HighPrecisionNumber} other
     * @returns {boolean}
     */
    equals(other) {
      return this.#n === other.#n
    }

    /**
     * lte :: Ord a => a ~> a -> Boolean
     * @param {HighPrecisionNumber} other
     * @returns {boolean}
     */
    lte(other) {
      return this.#n <= other.#n
    }

    /**
     * concat :: Semigroup a => a ~> a -> a
     * @param {HighPrecisionNumber} other
     * @returns {HighPrecisionNumber}
     */
    concat(other) {
      return new HighPrecisionNumber(
        insertDecimal(precision, this.#n + other.#n)
      )
    }

    /**
     * empty :: Monoid m => () -> m
     * @returns {HighPrecisionNumber}
     */
    static empty() {
      return new HighPrecisionNumber("0")
    }

    /**
     * invert :: Group g => g ~> () -> g
     * @returns {HighPrecisionNumber}
     */
    invert() {
      return new HighPrecisionNumber(insertDecimal(precision, -this.#n))
    }

    /**
     * of :: Pointed p => a -> p a
     * NOTE: this is not really Pointed since it's NOT a Functor, but this
     * method is still provided as a convenience to avoid using new.
     * @param {string} value
     * @returns {HighPrecisionNumber}
     */
    static of(value) {
      return new HighPrecisionNumber(value)
    }

    /**
     * valueOf :: HighPrecisionNumber a => a ~> () -> BigInt
     * @returns {bigint}
     */
    valueOf() {
      return this.#n
    }

    /**
     * toString :: HighPrecisionNumber a => a ~> () -> String
     * @returns {string}
     */
    toString() {
      return insertDecimal(precision, this.#n)
    }

    get [Symbol.toStringTag]() {
      return "HighPrecisionNumber"
    }

    [Symbol.for("nodejs.util.inspect.custom")]() {
      return `HighPrecisionNumber<${this.toString()}>`
    }
  }
}
