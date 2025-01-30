import { Precision } from "./index.js"
import { test } from "fvb"

const $ = Precision(2)

test("PrecisionNumber instance", t => {
  const m = new $(9.87)

  t.equal(
    typeof m,
    "object",
    "is an object"
  )

  t.equal(
    Object.prototype.toString.call(m),
    "[object PrecisionNumber]",
    "is an object of type [object PrecisionNumber]"
  )

  t.equal(
    m.valueOf(),
    987,
    "has a valueOf method that returns the unwrapped unit value"
  )

  t.equal(
    m.toString(),
    "9.87",
    "has a toString method that returns the formatted value"
  )

  t.equal(
    `hello ${m}!`,
    "hello 9.87!",
    "uses the toString method for interpolation of template strings"
  )

  t.plan(5)
})

test("PrecisionNumber equals method (Setoid)", t => {
  const a = new $(42.73)
  const b = new $(42.73)
  const c = new $(42.73)
  const d = new $(73.42)

  t.notOk(
    a.equals(d),
    "instances with different values are not equal"
  )

  t.ok(
    a.equals(a),
    "reflexivity: a.equals(a)"
  )

  t.ok(
    d.equals(d),
    "reflexivity: d.equals(d)"
  )

  t.ok(
    a.equals(b) === b.equals(a),
    "symmetry: a.equals(b) === b.equals(a)"
  )

  t.ok(
    a.equals(d) === d.equals(a),
    "symmetry: a.equals(d) === d.equals(a)"
  )

  t.ok(
    a.equals(b),
    "transitivity: if a.equals(b)"
  )

  t.ok(
    b.equals(c),
    "transitivity: and b.equals(c)"
  )

  t.ok(
    a.equals(c),
    "transitivity: then a.equals(c)"
  )

  t.throws(
    /* @ts-expect-error */
    () => a.equals(20.99),
    "throws error if not given a PrecisionNumber type"
  )

  t.plan(9)
})

test("PrecisionNumber lte method (Ord)", t => {
  const a = new $(37.11)
  const b = new $(37.12)
  const c = new $(37.12)

  t.ok(
    a.lte(b) || b.lte(a),
    "totality: a.lte(b) || b.lte(a)"
  )

  t.ok(
    b.lte(c) && c.lte(b),
    "antisymmetry: if b.lte(c) && c.lte(b)"
  )

  t.ok(
    b.equals(c),
    "antisymmetry: then b.equals(c)"
  )

  t.ok(
    a.lte(b) && b.lte(c),
    "transitivity: if a.lte(b) && b.lte(c)"
  )

  t.ok(
    a.lte(c),
    "transitivity: then a.lte(c)"
  )

  t.throws(
    /* @ts-expect-error */
    () => a.lte(0),
    "throws error if not given a PrecisionNumber type"
  )

  t.plan(6)
})

test("PrecisionNumber concat method (Semigroup)", t => {
  const a = new $(101.97)
  const b = new $(67.89)
  const c = new $(0.97)

  t.ok(
    (a.concat(b).concat(c)).equals(a.concat(b.concat(c))),
    "associativity: (a.concat(b).concat(c)).equals(a.concat(b.concat(c)))"
  )

  t.ok(
    a.concat(b).concat(c).valueOf() === a.concat(b.concat(c)).valueOf(),
    "associativity: a.concat(b).concat(c).valueOf() === a.concat(b.concat(c)).valueOf()"
  )

  const d = new $(0.2)
  const e = new $(0.1)

  t.equal(
    d.concat(e).toString(),
    "0.30",
    "value of concatenated PrecisionNumbers should be properly rounded"
  )

  t.plan(3)
})

test("PrecisionNumber empty static method (Monoid)", t => {
  const a = new $(44.20)

  t.equal(
    $.empty().valueOf(),
    0,
    "the valueOf $.empty() is 0"
  )

  t.equal(
    $.empty().toString(),
    "0.00",
    "the toString of $.empty() is \"0.00\""
  )

  t.equal(
    a.concat($.empty()).toString(),
    "44.20",
    "right identity: a.concat($.empty()) equals a"
  )

  t.equal(
    $.empty().concat(a).toString(),
    "44.20",
    "left identity: $.empty().concat(a) equals a"
  )

  t.equal(
    /* @ts-ignore */
    a.constructor.empty(),
    new $(0),
    "empty can be accessed via the constructor property"
  )

  t.equal(
    Object.prototype.toString.call($.empty()),
    "[object PrecisionNumber]",
    "returns an object of type [object PrecisionNumber]"
  )

  t.plan(6)
})

test("PrecisionNumber invert method (Group)", t => {
  const a = new $(101.23)
  const b = new $(-42.09)

  t.equal(
    a.invert().toString(),
    "-101.23",
    "invert method returns the opposite number (multiplied by -1)"
  )

  t.equal(
    b.invert().toString(),
    "42.09",
    "invert method returns the opposite number (multiplied by -1)"
  )

  t.equal(
    a.concat(a.invert()),
    $.empty(),
    "right inverse: a.concat(a.invert()).equals($.empty())"
  )

  t.equal(
    a.invert().concat(a),
    $.empty(),
    "left inverse: a.invert.concat(a).equals($.empty())"
  )

  t.plan(4)
})

test("PrecisionNumber of method (Pointed-ish)", t => {
  t.equal(
    $.of(5.295).toString(),
    "5.30",
    "should create new instance without using new keyword"
  )

  t.equal(
    $.of(4.73).concat($.of(5.299)).toString(),
    "10.03",
    "values created with of should behave the same as using the new keyword"
  )

  t.plan(2)
})

test("PrecisionNumber (precision)", t => {
  const $$$ = Precision(3)

  const a = new $$$(0.110)
  const b = new $$$(0.123)

  t.equal(
    a.concat(b).toString(),
    "0.233",
    "value of concatenated PrecisionNumbers should be properly rounded (precision 3)"
  )

  const BTC = Precision(8)

  const c = new BTC(0.12345678)
  const d = new BTC(0.87654321)

  t.equal(
    c.concat(d).toString(),
    "0.99999999",
    "value of concatenated PrecisionNumbers should be properly rounded (precision 8)"
  )

  t.equal(
    (new BTC(0)).toString(),
    "0.00000000",
    "the toString of PrecisionNumber with value of 0 and precision of 8 is \"0.00000000\""
  )

  const ZERO = Precision(0)

  t.equal(
    (new ZERO(100173)).concat(new ZERO(17)).toString(),
    "100190",
    "integers are properly added by concat method with precision of 0 decimals"
  )

  const e = new ZERO(100.99)
  const f = new ZERO(17.01)

  t.equal(
    e.toString(),
    "101",
    "floats are properly rounded with precision of 0 decimals"
  )

  t.equal(
    f.toString(),
    "17",
    "floats are properly rounded with precision of 0 decimals"
  )

  t.equal(
    e.concat(f).toString(),
    "118",
    "floats are properly rounded and added by concat with precision of 0 decimals"
  )

  const ONE = Precision(1)

  const g = new ONE(100.99)
  const h = new ONE(179.11)

  t.equal(
    g.toString(),
    "101.0",
    "floats are properly rounded with precision of 1 decimal"
  )

  t.equal(
    h.toString(),
    "179.1",
    "floats are properly rounded with precision of 1 decimal"
  )

  t.equal(
    g.concat(h).toString(),
    "280.1",
    "floats are properly rounded and added by concat with precision of 1 decimal"
  )

  t.plan(10)
})

test("Precision given invalid precision number", t => {
  t.throws(
    () => Precision(420.69),
    "should throw an error when precision is not an integer"
  )

  t.throws(
    () => Precision(-1),
    "should throw an error when precision is a negative integer"
  )

  t.plan(2)
})
