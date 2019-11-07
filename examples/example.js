let Ramp = require('../src')

let ramp = new Ramp(255)
ramp.go(9000)
ramp.go(1, 10000, 'LINEAR', 'ONCEFORWARD')

setInterval(() => {
  console.log(ramp.update())
}, 100)
