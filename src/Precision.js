/**
 * @param {number} precision
 */
export const Precision = precision => {
  if (precision < 0 || Math.floor(precision) !== precision) {
    throw new Error("Error: precision must be a positive integer")
  }

  return class PrecisionNumber {
    #n

    /**
     * @param {number} value
     */
    constructor(value) {
      this.#n = Math.round(+value * 10 ** precision)
    }

    /**
     * equals :: Setoid a => a ~> a -> Boolean
     * @param {PrecisionNumber} other
     * @returns {boolean}
     */
    equals(other) {
      return this.#n === other.#n
    }

    /**
     * lte :: Ord a => a ~> a -> Boolean
     * @param {PrecisionNumber} other
     * @returns {boolean}
     */
    lte(other) {
      return this.#n <= other.#n
    }

    /**
     * concat :: Semigroup a => a ~> a -> a
     * @param {PrecisionNumber} other
     * @returns {PrecisionNumber}
     */
    concat(other) {
      return new PrecisionNumber((this.#n + other.#n) / 10 ** precision)
    }

    /**
     * empty :: Monoid m => () -> m
     * @returns {PrecisionNumber}
     */
    static empty() {
      return new PrecisionNumber(0)
    }

    /**
     * invert :: Group g => g ~> () -> g
     * @returns {PrecisionNumber}
     */
    invert() {
      return new PrecisionNumber(-this.#n / 10 ** precision)
    }

    /**
     * of :: Pointed p => a -> p a
     * NOTE: this is not really Pointed since it's NOT a Functor, but this
     * method is still provided as a convenience to avoid using new.
     * @param {number} value
     * @returns {PrecisionNumber}
     */
    static of(value) {
      return new PrecisionNumber(value)
    }

    /**
     * valueOf :: PrecisionNumber a => a ~> () -> Number
     * @returns {number}
     */
    valueOf() {
      return this.#n
    }

    /**
     * toString :: PrecisionNumber a => a ~> () -> String
     * @returns {string}
     */
    toString() {
      return (this.#n / 10 ** precision).toFixed(precision)
    }

    get [Symbol.toStringTag]() {
      return "PrecisionNumber"
    }

    [Symbol.for("nodejs.util.inspect.custom")]() {
      return `PrecisionNumber<${this.toString()}>`
    }
  }
}
