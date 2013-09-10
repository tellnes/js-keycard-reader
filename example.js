var keyCardReader = require('./')

var kcr = keyCardReader({ min: 4 }, function (code) {
  console.log(code)
})

kcr.destroy()
