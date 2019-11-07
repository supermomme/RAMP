module.exports = class RAMP {
  constructor(_val = 0) {
    this._init(_val)
  }
  _init(_val) {
    this.A = _val
    this.B = _val
    this.val = _val
    this.mode = 'NONE'
    this.t = new Date().getTime()
    this.dur = 0
    this.pos = 0
    this.grain = 10
    this.loop = 'ONCEFORWARD'
    this.speed = 'FORWARD'
    this.automated = true
    this.paused = false
  }

  /*-----------------------------
  CLASS METHODS
  -----------------------------*/

  duration() {
    return this.dur
  }

  value() {
    return this.val
  }

  origin() {
    return this.A
  }

  target() {
    return this.B
  }

  go(_val, _dur = 0, _mode = 'NONE', _loop = 'ONCEFORWARD') {
    this.A = this.val
    this.B = _val
    this.mode = _mode
    this.dur = _dur
    this.t = new Date().getTime()
    
    if (_loop === 'ONCEFORWARD' || _loop === 'LOOPFORWARD' || _loop === 'FORTHANDBACK') {
      this.pos   = 0
      this.speed = 'FORWARD'
    }
    else {
      this.pos   = this.dur
      this.speed = 'BACKWARD'
    }
    this.loop = _loop
    this.paused = false
    return this.val
  }

  update() {
    let doUpdate = true
    let newTime;
    let delta = this.grain;
    
    if (this.automated) {
      newTime = new Date().getTime()
      delta = newTime - this.t;
      doUpdate = delta > this.grain;
    }
    
    if (doUpdate) {

      this.t = newTime;
      if (!this.paused) {
        switch (this.speed) {
          case 'FORWARD':
            if (this.pos <= this.dur - delta) {
              this.pos += delta;
            } else this.pos = this.dur;
            break;
          case 'BACKWARD':
            if (this.pos >= delta) {
              this.pos -= delta;
            } else this.pos = 0;
            break;
        }

        if (this.mode != 'NONE') {
          let k = this.pos/this.dur;
          this.val = this.A + (this.B-this.A) * this.ramp_calc(k, this.mode);
          constrain(this.val, this.A, this.B);                             //potential
        } else {
          this.val = this.B;
        }
      }

      if (this.isFinished()) {
        switch (this.loop) {
          case 'LOOPFORWARD':
            this.pos = 0;
            break;
          case 'LOOPBACKWARD':
            this.pos = this.dur;
            break;
          case 'FORTHANDBACK':
          case 'BACKANDFORTH':
            switch (this.speed) {
              case 'FORWARD':
                this.speed = 'BACKWARD';
                break;
              case 'BACKWARD':
                this.speed = 'FORWARD';
                break;
            }
            break;

          case 'ONCEBACKWARD':
          case 'ONCEFORWARD':
          default:
            break;
        }
      }
    }

    return this.val;
  }

  /*-----------------------------
  RAMP STATES & ACTIONS
  -----------------------------*/

  isFinished() {
    if (this.speed == 'FORWARD')
        return (this.pos>=this.dur);
    if (this.speed == 'BACKWARD')
        return (this.pos<=0);
  }

  isRunning() {
    return (!this.isFinished() && !this.paused);
  }

  isPaused() {
    return (!this.paused);
  }

  pause() {
    this.paused = true;
  }

  resume() {
    this.paused = false;
  }

  setAutomation(_automated) {
    this.automated = _automated;
  }

  setInterval(_interval) {
    setGrain(_interval);
  }

  setGrain(_grain) {
    this.grain = _grain;
  }

  /*-----------------------------
  GENERIC FUNCTIONS
  -----------------------------*/

  powin(k, p) {
    return Math.pow(k,p);
  }

  powout(k, p) {
    return 1-Math.pow(1-k,p);
  }

  powinout(k, p) {
    k *= 2;
    if (k<1)
      return 0.5*Math.pow(k,p);
    return 1-0.5*Math.abs(Math.pow(2-k,p));
  }

  ramp_calc(k, m) {

    if (k == 0 || k == 1)
        return k;
    
    let a, p, s;
    
    switch (m) {
        case 'QUADRATIC_IN':
            return this.powin(k,2);
            
        case 'QUADRATIC_OUT':
            return this.powout(k,2);
            
        case 'QUADRATIC_INOUT':
            return this.powinout(k,2);
            
        case 'CUBIC_IN':
            return this.powin(k,3);
            
        case 'CUBIC_OUT':
            return this.powout(k,3);
            
        case 'CUBIC_INOUT':
            return this.powinout(k,3);
            
        case 'QUARTIC_IN':
            return this.powin(k,4);
            
        case 'QUARTIC_OUT':
            return this.powout(k,4);
            
        case 'QUARTIC_INOUT':
            return this.powinout(k,4);
            
        case 'QUINTIC_IN':
            return this.powin(k,5);
            
        case 'QUINTIC_OUT':
            return this.powout(k,5);
            
        case 'QUINTIC_INOUT':
            return this.powinout(k,5);
            
        case 'SINUSOIDAL_IN':
            return 1-Math.cos(k*(Math.PI/2));
            
        case 'SINUSOIDAL_OUT':
            return Math.sin(k*(Math.PI/2));
            
        case 'SINUSOIDAL_INOUT':
            return -0.5*(Math.cos(Math.PI*k)-1);
            
        case 'EXPONENTIAL_IN':
            return this.pow(2,10*(k-1));
            
        case 'EXPONENTIAL_OUT':
            return (1-this.pow(2,-10*k));
            
        case 'EXPONENTIAL_INOUT':
            k *= 2.;
            if (k<1)
                return 0.5*this.pow(2,10*(k-1));
            k--;
            return 0.5*(2-this.pow(2,-10*k));
            
        case 'CIRCULAR_IN':
            return -(Math.sqrt(1-k*k)-1);
            
        case 'CIRCULAR_OUT':
            k--;
            return Math.sqrt(1-k*k);
            
        case 'CIRCULAR_INOUT':
            k *= 2;
            if (k<1)
                return -0.5*(Math.sqrt(1-k*k)-1);
            k -= 2;
            return 0.5*(Math.sqrt(1-k*k)+1);
            
        case 'ELASTIC_IN':
            k -= 1;
            a = 1;
            p = 0.3*1.5;
            s = p*Math.asin(1/a) / (2*Math.PI);
            return -a*Math.pow(2,10*k)*Math.sin((k-s)*(2*Math.PI)/p);
            
        case 'ELASTIC_OUT':       //BUG???
            a = 1;
            p = 0.3;
            s = p*Math.asin(1/a) / (2*Math.PI);
            return (a*Math.pow(2,-10*k)*Math.sin((k-s)*(2*Math.PI)/p)+1);
            
            
        case 'ELASTIC_INOUT':     //BUG???
            k = k*2 - 1;
            a = 1;
            p = 0.3*1.5;
            s = p*Math.asin(1/a) / (2*Math.PI);
            if ((k + 1) < 1)
                return -0.5*a*Math.pow(2,10*k)*Math.sin((k-s)*(2*Math.PI)/p);
            return a*Math.pow(2,-10*k)*Math.sin((k-s)*(2*Math.PI)/p)*0.5+1;
            
        case 'BACK_IN':
            s = 1.70158;
            return k*k*((s+1)*k-s);
            
        case 'BACK_OUT':
            k--;
            s = 1.70158;
            return k*k*((s+1)*k+s)+1;
            
        case 'BACK_INOUT':
            k *= 2;
            s = 1.70158;
            s *= 1.525;
            if (k < 1)
                return 0.5*k*k*((s+1)*k-s);
            k -= 2;
            return 0.5*k*k*((s+1)*k+s)+1;
            
        case 'BOUNCE_IN':
            return 1-this.ramp_calc(1-k,'BOUNCE_OUT');
            
        case 'BOUNCE_OUT':
            if (k < (1/2.75))
                return 7.5625*k*k;
            if (k < (2/2.75)) {
                k -= 1.5/2.75;
                return 7.5625*k*k+0.75;
            }
            if (k < (2.5/2.75)) {
                k -= (2.25/2.75);
                return 7.5625*k*k+0.9375;
            }
            k -= (2.625/2.75);
            return 7.5625*k*k+0.984375;
            
        case 'BOUNCE_INOUT':
            if (k < 0.5) {
                return this.ramp_calc(k*2,'BOUNCE_IN')*0.5;
            }
            return this.ramp_calc(k*2-1,'BOUNCE_OUT')*0.5+0.5;
            break;
            
        case 'LINEAR':
        default:
            return k;
    }
  }
}

function constrain (x, min, max) {
  return Math.min(Math.max(x, min), max)
}
