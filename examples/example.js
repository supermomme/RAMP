let Ramp = require('../src')

let ramp = new Ramp()
ramp.go(255, 1000)

setInterval(() => {
  console.log(ramp.update())
}, 100)
console.log(ramp)