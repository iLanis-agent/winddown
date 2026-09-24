// WindDown engine - pre-sleep schedule math (no DOM)
(function (root) {
  'use strict';

  var DEFAULT_STEPS = [
    { id: 'dim',    label: 'Dim the lights',        lead: 60 },
    { id: 'tidy',   label: 'Set out tomorrow',       lead: 50 },
    { id: 'screens',label: 'Screens off',            lead: 45 },
    { id: 'shower', label: 'Warm shower',            lead: 30 },
    { id: 'read',   label: 'Read a few pages',       lead: 20 },
    { id: 'breathe',label: 'Slow breathing in bed',  lead: 5 }
  ];

  function parseHM(s) {
    var p = String(s).split(':');
    return { h: +p[0] || 0, m: +p[1] || 0 };
  }

  function nextOccurrence(timeStr, now) {
    var t = parseHM(timeStr);
    var d = new Date(now.getTime());
    d.setHours(t.h, t.m, 0, 0);
    if (d.getTime() <= now.getTime()) d.setDate(d.getDate() + 1);
    return d;
  }

  function schedule(bedtimeStr, now, steps) {
    var bed = nextOccurrence(bedtimeStr, now);
    var list = (steps || DEFAULT_STEPS).map(function (s) {
      return { id: s.id, label: s.label, lead: s.lead, at: new Date(bed.getTime() - s.lead * 60000) };
    });
    list.sort(function (a, b) { return a.at - b.at; });
    return { bedtime: bed, steps: list };
  }

  function currentStep(sched, now) {
    var cur = null;
    for (var i = 0; i < sched.steps.length; i++) {
      if (sched.steps[i].at.getTime() <= now.getTime()) cur = sched.steps[i];
    }
    return cur;
  }

  function nextStep(sched, now) {
    for (var i = 0; i < sched.steps.length; i++) {
      if (sched.steps[i].at.getTime() > now.getTime()) return sched.steps[i];
    }
    return null;
  }

  function sleepHours(bedtimeStr, wakeStr) {
    var b = parseHM(bedtimeStr), w = parseHM(wakeStr);
    var mins = (w.h * 60 + w.m) - (b.h * 60 + b.m);
    if (mins <= 0) mins += 1440;
    return Math.round(mins / 6) / 10;
  }

  function minutesToBed(bedtimeStr, now) {
    return Math.round((nextOccurrence(bedtimeStr, now).getTime() - now.getTime()) / 60000);
  }

  function streak(nights, today) {
    var days = {};
    nights.forEach(function (n) { days[n.date] = true; });
    var s = 0;
    for (var d = 0; d < 400; d++) {
      var day = new Date(today.getTime());
      day.setDate(day.getDate() - d);
      var key = day.getFullYear() + '-' + String(day.getMonth() + 1).padStart(2, '0') + '-' + String(day.getDate()).padStart(2, '0');
      if (days[key]) s++;
      else if (d === 0) continue;
      else break;
    }
    return s;
  }

  var api = { DEFAULT_STEPS: DEFAULT_STEPS, parseHM: parseHM, nextOccurrence: nextOccurrence,
    schedule: schedule, currentStep: currentStep, nextStep: nextStep,
    sleepHours: sleepHours, minutesToBed: minutesToBed, streak: streak };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.WindEngine = api;
})(typeof self !== 'undefined' ? self : this);
