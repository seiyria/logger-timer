
export interface LoggerTimerOptions {
  isActive: boolean;
  dumpThreshold: number;
}

export class LoggerTimer {

  private timerStarts: { [timer: string]: number } = {};
  private timerStops:  { [timer: string]: number } = {};

  // used to toggler if this loggertimer should track anything
  // you probably want this in dev mode, but not in prod mode
  private isActive: boolean;

  // used to filter out timer dumps by a minimum value
  private dumpThreshold: number;

  constructor(opts: LoggerTimerOptions = { isActive: true, dumpThreshold: 0 }) {
    this.isActive = opts.isActive;
    this.dumpThreshold = opts.dumpThreshold;
  }

  // start a timer with a name
  public startTimer(timerName: string) {

    // can't start timers if not active
    if(!this.isActive) return;

    // can't start a started timer
    if(this.timerStarts[timerName]) throw new Error(`Timer ${timerName} has already been started!`);

    this.timerStarts[timerName] = Date.now();
  }

  public stopTimer(timerName: string) {

    // not that it should matter, but it doesn't hurt to be thorough
    if(!this.isActive) return;

    // if a timer hasn't been started, it can't be stopped
    if(!this.timerStarts[timerName]) throw new Error(`Timer ${timerName} has not been started!`);

    // just some sanity checking
    if(this.timerStops[timerName]) throw new Error(`Timer ${timerName} has already been stopped!`);

    this.timerStops[timerName] = Date.now();
  }

  // just in case someone wants to reuse a timer instance
  public setActive(isActive: boolean) {
    this.isActive = isActive;
  }

  public getTimerDeltas(): { [timer: string]: number } {

    // only iterate over timerStops because we don't care about unstopped timers
    return Object.keys(this.timerStops).reduce((prev, cur) => {
      prev[cur] = this.timerStops[cur] - this.timerStarts[cur];
      return prev;
    }, {});
  }

  // dump the timers in a nice format, default to console.info
  public dumpTimers(cb?: (this: void, args) => void);
  public dumpTimers<T>(cb: (this: T, args) => void, thisArg: T);
  public dumpTimers<T>(cb: (this: T | void, args) => void = console.log, thisArg?: T) {
    const deltas = this.getTimerDeltas();
    Object.keys(deltas).forEach(timerName => {
      const delta = deltas[timerName];
      if(delta < this.dumpThreshold) return;

      cb.call(thisArg, `[${delta}ms] ${timerName}`);
    });
  }

}
