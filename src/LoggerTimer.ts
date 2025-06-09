export interface LoggerTimerOptions {
  isActive: boolean;
  dumpThreshold: number;
}

type TimerKey = string;

export class LoggerTimer {
  private timerStarts: Record<TimerKey, number> = {};
  private timerStops: Record<TimerKey, number> = {};

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
  public startTimer(timerName: TimerKey) {
    // can't start timers if not active
    if (!this.isActive) return;

    // can't start a started timer
    if (this.timerStarts[timerName])
      throw new Error(`Timer ${timerName} has already been started!`);

    this.timerStarts[timerName] = Date.now();
  }

  public stopTimer(timerName: TimerKey) {
    // not that it should matter, but it doesn't hurt to be thorough
    if (!this.isActive) return;

    // if a timer hasn't been started, it can't be stopped
    if (!this.timerStarts[timerName])
      throw new Error(`Timer ${timerName} has not been started!`);

    // just some sanity checking
    if (this.timerStops[timerName])
      throw new Error(`Timer ${timerName} has already been stopped!`);

    this.timerStops[timerName] = Date.now();
  }

  // just in case someone wants to reuse a timer instance
  public setActive(isActive: boolean) {
    this.isActive = isActive;
  }

  public getTimerDeltas(): Record<TimerKey, number> {
    const deltas: Record<TimerKey, number> = {};

    // only iterate over timerStops because we don't care about unstopped timers
    Object.keys(this.timerStops).forEach((timerKey) => {
      deltas[timerKey] = this.timerStops[timerKey] - this.timerStarts[timerKey];
    });

    return deltas;
  }

  // dump the timers in a nice format, default to console.info
  public dumpTimers(cb: (args: string) => void = console.info) {
    const deltas = this.getTimerDeltas();
    Object.keys(deltas).forEach((timerName) => {
      const delta = deltas[timerName];
      if (delta < this.dumpThreshold) return;

      cb(`[${delta}ms] ${timerName}`);
    });
  }
}
