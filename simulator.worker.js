'use strict';

// ── Named constants (replaces every magic number) ─────────────────────────────
const YEARS             = 30;
const MIN_SIMS          = 10_000;
const SALE_COST_PCT     = 0.050;   // seller-side agent + title transfer on exit
const PURCHASE_COST_PCT = 0.044;   // stamp duty 4 % + title deed 0.4 % at purchase
const INF_SIGMA         = 0.08;    // inflation annual std-dev
const APP_SIGMA         = 0.18;    // home-appreciation annual std-dev
const RENT_SIGMA        = 0.12;    // rent annual std-dev
const INV_SIGMA         = 0.12;    // investment-return annual std-dev
const RENT_REGIME_P     = 0.10;    // probability of rent-law shock each year
const RENT_REGIME_BUMP  = 0.15;    // extra rent growth in a shock year
const HOME_FLOOR        = 0.65;    // minimum yr/yr home value multiplier
const RENT_FLOOR        = 0.70;    // minimum yr/yr rent multiplier
const SENS_SIMS         = 3_000;   // paths per sensitivity run (speed vs accuracy)
const SENS_DELTA        = 0.20;    // ± 20 % variation per input

// ── Math helpers ──────────────────────────────────────────────────────────────
// Box-Muller: 1-Math.random() guards against log(0)
function randn() {
  return Math.sqrt(-2 * Math.log(1 - Math.random())) *
         Math.cos(2 * Math.PI * (1 - Math.random()));
}

function quantile(arr, q) {
  const s = Float64Array.from(arr).sort();
  return s[Math.floor((s.length - 1) * q)];
}

// ── Mortgage helper ───────────────────────────────────────────────────────────
// annualRate is the yearly rate (e.g. 0.032 for 3.2%).
// CRITICAL FIX: divide by 12 to get the monthly rate — the original code
// was passing the annual rate directly as monthly, massively overstating costs.
function mortgagePayment(principal, annualRate, months) {
  const r = annualRate / 12;
  if (r === 0) return principal / months;
  const x = (1 + r) ** months;
  return principal * (r * x) / (x - 1);
}

function valueTransform(v, inflIdx, usdTry, mode) {
  if (mode === 'real') return v / inflIdx;
  if (mode === 'usd')  return v / usdTry;
  return v;
}

// ── Core Monte Carlo simulation ───────────────────────────────────────────────
function runSimulation(inp) {
  const sims      = Math.max(MIN_SIMS, inp.simCount);
  const annRate   = inp.mortgageRate / 100;
  const loanMos   = inp.loanYears * 12;
  const down      = inp.homePrice * (inp.downPaymentPct / 100);
  const principal = inp.homePrice - down;
  // Stamp duty + title deed: buyer pays these upfront in addition to the down payment.
  // Fair comparison: the renter invests this same total outlay (down + buyCosts).
  const buyCosts  = inp.homePrice * PURCHASE_COST_PCT;
  const mPay      = mortgagePayment(principal, annRate, loanMos);

  const buySeries  = Array.from({ length: YEARS + 1 }, () => []);
  const rentSeries = Array.from({ length: YEARS + 1 }, () => []);
  const diffY10 = [], diffY20 = [], diffY30 = [];
  const beats = [], breakevens = [];

  for (let s = 0; s < sims; s++) {
    let homeValue  = inp.homePrice;
    let rent       = inp.monthlyRent;
    let maint      = inp.maintenance * 12;
    let balance    = principal;
    let inflIdx    = 1;
    let usdTry     = inp.usdTry;
    let investment = down + buyCosts;  // renter invests what buyer spent upfront
    let firstBE    = null;

    for (let y = 0; y <= YEARS; y++) {
      const saleCost = homeValue * SALE_COST_PCT;
      const buyNet   = homeValue - balance - saleCost;
      const dBuy     = valueTransform(buyNet,     inflIdx, usdTry, inp.valueMode);
      const dRent    = valueTransform(investment, inflIdx, usdTry, inp.valueMode);

      buySeries[y].push(dBuy);
      rentSeries[y].push(dRent);

      if (firstBE === null && dBuy > dRent) firstBE = y;
      if (y === 10) diffY10.push(dBuy - dRent);
      if (y === 20) diffY20.push(dBuy - dRent);
      if (y === 30) {
        diffY30.push(dBuy - dRent);
        beats.push(dBuy > dRent ? 1 : 0);
      }

      if (y === YEARS) break;

      // ── Annual shocks ────────────────────────────────────────────────────────
      const infShock = Math.max(-0.15, inp.inflation / 100 + INF_SIGMA * randn());
      inflIdx  *= 1 + infShock;
      usdTry   *= 1 + Math.max(0, infShock - 0.03);

      homeValue *= Math.max(HOME_FLOOR, 1 + inp.homeAppreciation / 100 + APP_SIGMA * randn());

      const regimeBoost = Math.random() < RENT_REGIME_P ? RENT_REGIME_BUMP : 0;
      rent *= Math.max(RENT_FLOOR,
                1 + inp.rentIncrease / 100 + regimeBoost + RENT_SIGMA * randn());

      maint *= 1 + Math.max(0, infShock - 0.02);

      // ── Monthly mortgage amortization ────────────────────────────────────────
      const r = annRate / 12;  // monthly rate (fixed)
      let annMortgage = 0;
      for (let m = 0; m < 12; m++) {
        if (y * 12 + m < loanMos && balance > 0) {
          const interest = balance * r;
          const paid     = Math.min(balance, mPay - interest);
          balance        = Math.max(0, balance - paid);
          annMortgage   += paid + interest;
        }
      }

      // ── Cash-flow delta: positive means buyer spends more ────────────────────
      const propTax = homeValue * (inp.propertyTaxPct / 100);
      const buyOut  = annMortgage + propTax + maint;
      const rentOut = rent * 12;
      const delta   = buyOut - rentOut;

      // investmentReturn is the expected real return (e.g. 12%).
      // Adding infShock converts it to a nominal return for that year.
      const invReturn = inp.investmentReturn / 100 + infShock + INV_SIGMA * randn();
      // delta > 0 → renter saves delta more than buyer each year → invested
      investment = Math.max(0, investment * (1 + invReturn) + delta);
    }

    breakevens.push(firstBE ?? YEARS);
  }

  const q        = (arr, v) => quantile(arr, v);
  const summarize = arr => ({ p10: q(arr, 0.1), median: q(arr, 0.5), p90: q(arr, 0.9) });

  return {
    years:           Array.from({ length: YEARS + 1 }, (_, i) => i),
    medianBuy:       buySeries.map(a => q(a, 0.5)),
    p10Buy:          buySeries.map(a => q(a, 0.1)),
    p90Buy:          buySeries.map(a => q(a, 0.9)),
    medianRent:      rentSeries.map(a => q(a, 0.5)),
    p10Rent:         rentSeries.map(a => q(a, 0.1)),
    p90Rent:         rentSeries.map(a => q(a, 0.9)),
    p10:             q(diffY30, 0.1),
    p90:             q(diffY30, 0.9),
    beatProbability: beats.reduce((a, b) => a + b, 0) / beats.length * 100,
    breakevenMedian: q(breakevens, 0.5),
    breakevenLow:    q(breakevens, 0.1),
    breakevenHigh:   q(breakevens, 0.9),
    dists: {
      y10: summarize(diffY10),
      y20: summarize(diffY20),
      y30: summarize(diffY30),
    },
  };
}

// ── Sensitivity / tornado analysis ───────────────────────────────────────────
// Varies each key input ±SENS_DELTA and measures the year-30 median (Buy-Rent).
function runSensitivity(baseInp) {
  const inp  = { ...baseInp, simCount: SENS_SIMS };
  const base = runSimulation(inp).dists.y30.median;

  const keys = [
    'homePrice', 'monthlyRent', 'downPaymentPct', 'mortgageRate',
    'homeAppreciation', 'rentIncrease', 'investmentReturn', 'inflation',
  ];

  const results = keys.map(key => {
    const v    = baseInp[key];
    const low  = runSimulation({ ...inp, [key]: v * (1 - SENS_DELTA) }).dists.y30.median;
    const high = runSimulation({ ...inp, [key]: v * (1 + SENS_DELTA) }).dists.y30.median;
    return { key, low, high };
  });

  return { base, results };
}

// ── Message handler ───────────────────────────────────────────────────────────
self.onmessage = (e) => {
  const inputs      = e.data;
  const simulation  = runSimulation(inputs);
  const sensitivity = runSensitivity(inputs);
  self.postMessage({ simulation, sensitivity });
};
