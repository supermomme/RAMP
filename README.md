# RAMP
NodeJS Interpolation Library

## New objects

The library add a class template to manage interpolation beetween values of various data types.

* **rampNumber** ramp object for "number" interpolation

## Methods

* **go()** go to a new value
* **value()** get actual value of the interpolation
* **origin()** get last origin value of the interpolation
* **target()** get last target value of the interpolation
* **duration()** get last duration of the interpolation
* **update()** update value of the interpolation according to its parameters
* **pause()** pause the interpolation
* **resume()** resume from pause
* **setGrain()** set interpolation grain
* **setAutomation()** set automation mode
* **isPaused()** pause state
* **isRunning()** running state
* **isFinished()** finish state

## Examples

First you need to instanciate the object as a global variable :

	let myRamp = new Ramp();

Then you need to a new value to reach : 

	myRamp.go(new_value, (ramp_duration), (ramp_mode), (loop_mode));

At least you'll need to update to get the actual interpolation value :

	myInterpolationValue = myRamp.update();

## Interpolation mode

* **NONE**
* **LINEAR**
* **QUADRATIC_IN**
* **QUADRATIC_OUT**
* **QUADRATIC_INOUT**
* **CUBIC_IN**
* **CUBIC_OUT**
* **CUBIC_INOUT**
* **QUARTIC_IN**
* **QUARTIC_OUT**
* **QUARTIC_INOUT**
* **QUINTIC_IN**
* **QUINTIC_OUT**
* **QUINTIC_INOUT**
* **SINUSOIDAL_IN**
* **SINUSOIDAL_OUT**
* **SINUSOIDAL_INOUT**
* **EXPONENTIAL_IN**
* **EXPONENTIAL_OUT**
* **EXPONENTIAL_INOUT**
* **CIRCULAR_IN**
* **CIRCULAR_OUT**
* **CIRCULAR_INOUT**
* **ELASTIC_IN**
* **ELASTIC_OUT**
* **ELASTIC_INOUT**
* **BACK_IN**
* **BACK_OUT**
* **BACK_INOUT**
* **BOUNCE_IN**
* **BOUNCE_OUT**
* **BOUNCE_INOUT**

## Loop mode

* **ONCEFORWARD**
* **LOOPFORWARD**
* **FORTHANDBACK**
* **ONCEBACKWARD**
* **LOOPBACKWARD**
* **BACKANDFORTH**

# Disclaimer
This Libary is just translated from [RAMP for Arduino (siteswapjuggler)](https://github.com/siteswapjuggler/RAMP). I will merge updates from that Libary into this Libary. But i am not an expert at this topic. Have fun :)
