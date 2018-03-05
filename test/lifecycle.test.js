import { h, patch } from "../src"

beforeEach(() => {
  document.body.innerHTML = ""
})

test("oncreate", () => {
  document.body.appendChild(
    patch(
      h(
        "div",
        {
          oncreate(element) {
            element.className = "foo"
          }
        },
        "foo"
      )
    )
  )

  expect(document.body.innerHTML).toBe(`<div class="foo">foo</div>`)
})

test("onupdate", done => {
  const view = state =>
    h(
      "div",
      {
        class: state,
        onupdate(element, old) {
          expect(element.textContent).toBe("bar")
          expect(old.class).toBe("foo")
          done()
        }
      },
      state
    )

  patch(view("bar"), document.body.appendChild(patch(view("foo"))))
})

test("onremove", done => {
  const view = state =>
    state
      ? h("ul", {}, [
          h("li"),
          h("li", {
            onremove(element, remove) {
              remove()
              expect(document.body.innerHTML).toBe("<ul><li></li></ul>")
              done()
            }
          })
        ])
      : h("ul", {}, [h("li")])

  patch(view(false), document.body.appendChild(patch(view(true))))
})

test("ondestroy", done => {
  const view = state =>
    state
      ? h("ul", {}, [
          h("li"),
          h("li", {}, [
            h("span", {
              ondestroy() {
                expect(document.body.innerHTML).toBe(
                  "<ul><li></li><li><span></span></li></ul>"
                )
                setTimeout(() => {
                  expect(document.body.innerHTML).toBe("<ul><li></li></ul>")
                  done()
                })
              }
            })
          ])
        ])
      : h("ul", {}, [h("li")])

  patch(view(false), document.body.appendChild(patch(view(true))))
})

test("onremove/ondestroy", done => {
  let destroyed = false

  const view = state =>
    state
      ? h("ul", {}, [
          h("li"),
          h("li", {
            ondestroy() {
              destroyed = true
            },
            onremove(element, remove) {
              expect(destroyed).toBe(false)
              remove()
              expect(destroyed).toBe(true)
              done()
            }
          })
        ])
      : h("ul", {}, [h("li")])

  patch(view(false), document.body.appendChild(patch(view(true))))
})

test("event bubbling", done => {
  let count = 0

  const view = state =>
    h(
      "main",
      {
        oncreate() {
          expect(count++).toBe(3)
        },
        onupdate() {
          expect(count++).toBe(7)
          done()
        }
      },
      [
        h("p", {
          oncreate() {
            expect(count++).toBe(2)
          },
          onupdate() {
            expect(count++).toBe(6)
          }
        }),
        h("p", {
          oncreate() {
            expect(count++).toBe(1)
          },
          onupdate() {
            expect(count++).toBe(5)
          }
        }),
        h("p", {
          oncreate() {
            expect(count++).toBe(0)
          },
          onupdate() {
            expect(count++).toBe(4)
          }
        })
      ]
    )

  patch(view(), document.body.appendChild(patch(view())))
})
