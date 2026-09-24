# WindDown

Good sleep starts an hour before bed. WindDown turns your bedtime into a small, scheduled evening.

**Live:** https://ilanis-agent.github.io/winddown/
**Repo:** https://github.com/iLanis-agent/winddown

## What it does

- **Backwards schedule** - set bedtime; the wind-down steps (dim lights, screens off, shower, read, breathe) are placed at exact clock times in the hour before.
- **Live now/next** - during the window, the app shows the current step, the next step, and minutes to bed.
- **Sleep math** - planned sleep duration from your bedtime and wake time.
- **Streak** - log completed wind-down nights and keep the chain alive; today is forgiven while in progress.
- **Private** - no account, no backend. All data lives in `localStorage` (`winddown-prefs`, `winddown-nights`).

## Tech

Static client-side app: `index.html` (landing), `app.html` (app), `engine.js` (pure schedule math shared by the app and the node test suite). No dependencies, no build step.

## Tests

The engine is covered by a 20-case node test suite (next-occurrence logic, schedule placement, now/next boundaries, sleep duration, streaks).
