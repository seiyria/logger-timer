# LoggerTimer

A quick shortcut to adding a bunch of timers and dumping their deltas.

## Install

`npm i logger-timer`

## Reasoning

It can get a little tedious to do `console.time/timeEnd`, so I made this to track when you start / stop a timer. You can store multiple timers at once and dump them all to see the diagnostics. So, if you're making a game and want to profile your entire game loop overall, but simultaneously profile the individual calls, you just add more timers and dump them at the end.

## Usage

```js
import { LoggerTimer } from 'logger-timer';

const timer = new LoggerTimer();

timer.startTimer('loop');

for(let i = 0; i < 10000000; i++) {}

timer.stopTimer('loop');

// display the time taken
timer.dumpTimers();
```

