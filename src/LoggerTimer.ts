
export interface LoggerTimerOptions {
  isActive: boolean;
}

export class LoggerTimer {

  private timerStarts: { [timer: string]: number } = {};
  private timerStops:  { [timer: string]: number } = {};

  // used to toggler if this loggertimer should track anything
  // you probably want this in dev mode, but not in prod mode
  private isActive: boolean;

  constructor(opts: LoggerTimerOptions = { isActive: true }) {
    this.isActive = opts.isActive;
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
  public dumpTimers(cb: (args) => void = console.info) {
    const deltas = this.getTimerDeltas();
    Object.keys(deltas).forEach(timerName => {
      cb(`[${deltas[timerName]}ms] ${timerName}`);
    });
  }

}