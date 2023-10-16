import React from 'react'
import renderer from 'react-test-renderer'

import mx from '../src/index'

function toJson(component: renderer.ReactTestRenderer) {
  const result = component.toJSON()
  expect(result).toBeDefined()
  expect(result).not.toBeInstanceOf(Array)
  return result as renderer.ReactTestRendererJSON
}

test('expect same classname', () => {
  const button1 = renderer.create(
    <button className={mx("foo", "bar", "baz")}>Confirm</button>,
  )
  const button1Json = toJson(button1)

  expect(button1Json).toMatchSnapshot()

  const button2 = renderer.create(
    <button className={mx({
      a: true,
      b: false,
      c: 0,
      d: null,
      e: undefined,
      f: 1,
    })} >Confirm</button>,
  )
  const button2Json = toJson(button2)

  expect(button2Json).toMatchSnapshot()

  const button3 = renderer.create(
    <button className={mx({
      // falsy:
      null: null,
      emptyString: "",
      noNumber: NaN,
      zero: 0,
      negativeZero: -0,
      false: false,
      undefined: undefined,
      // truthy (literally anything else):
      nonEmptyString: "foobar",
      whitespace: " ",
      function: Object.prototype.toString,
      emptyObject: {},
      nonEmptyObject: { a: 1, b: 2 },
      emptyList: [],
      nonEmptyList: [1, 2, 3],
      greaterZero: 1,
    })} >Confirm</button>,
  )
  const button3Json = toJson(button3)

  expect(button3Json).toMatchSnapshot()
})