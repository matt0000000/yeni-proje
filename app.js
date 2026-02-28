'use strict';

// ── District data (expanded from 4 to 12 cities) ──────────────────────────────
const DISTRICTS = {
  'İstanbul / Kadıköy':     { homePrice: 7_800_000, monthlyRent: 42_000, maintenance: 2_500, propertyTaxPct: 0.22, source: 'TÜİK + Endeksa önbellek (2026-01)' },
  'İstanbul / Başakşehir':  { homePrice: 5_200_000, monthlyRent: 28_000, maintenance: 1_800, propertyTaxPct: 0.22, source: 'Sahibinden endeksi önbellek (2026-01)' },
  'Ankara / Çankaya':       { homePrice: 4_800_000, monthlyRent: 30_000, maintenance: 1_800, propertyTaxPct: 0.20, source: 'TÜİK + Sahibinden endeksi önbellek (2026-01)' },
  'Ankara / Keçiören':      { homePrice: 3_200_000, monthlyRent: 20_000, maintenance: 1_200, propertyTaxPct: 0.20, source: 'TÜİK önbellek (2026-01)' },
  'İzmir / Karşıyaka':      { homePrice: 5_200_000, monthlyRent: 32_000, maintenance: 1_700, propertyTaxPct: 0.20, source: 'Endeksa + TCMB bölgesel seri önbellek (2026-01)' },
  'İzmir / Bornova':        { homePrice: 4_100_000, monthlyRent: 25_000, maintenance: 1_400, propertyTaxPct: 0.20, source: 'Endeksa önbellek (2026-01)' },
  'Bursa / Nilüfer':        { homePrice: 3_600_000, monthlyRent: 23_000, maintenance: 1_300, propertyTaxPct: 0.18, source: 'TÜİK + yerel ilan ortalama önbellek (2026-01)' },
  'Antalya / Muratpaşa':    { homePrice: 4_500_000, monthlyRent: 28_000, maintenance: 1_600, propertyTaxPct: 0.20, source: 'Endeksa önbellek (2026-01)' },
  'Gaziantep / Şahinbey':   { homePrice: 2_400_000, monthlyRent: 15_000, maintenance:   900, propertyTaxPct: 0.16, source: 'TÜİK önbellek (2026-01)' },
  'Kocaeli / İzmit':        { homePrice: 3_000_000, monthlyRent: 19_000, maintenance: 1_100, propertyTaxPct: 0.18, source: 'Sahibinden önbellek (2026-01)' },
  'Eskişehir / Odunpazarı': { homePrice: 2_800_000, monthlyRent: 18_000, maintenance: 1_000, propertyTaxPct: 0.17, source: 'TÜİK önbellek (2026-01)' },
  'Mersin / Yenişehir':     { homePrice: 2_600_000, monthlyRent: 16_000, maintenance:   950, propertyTaxPct: 0.17, source: 'Endeksa önbellek (2026-01)' },
};

// ── i18n strings ──────────────────────────────────────────────────────────────
const STRINGS = {
  tr: {
    title: 'Kira mı Satın Alma mı? (Türkiye)',
    subtitle: '30 yıllık Monte Carlo simülasyonu ile karşılaştırma',
    inputTitle: 'Girdiler',
    resultsTitle: 'Sonuçlar',
    cityLabel: 'İl / İlçe',
    homePriceLabel: 'Konut fiyatı (₺)',
    rentLabel: 'Aylık kira (₺)',
    downPaymentLabel: 'Peşinat (%)',
    mortgageRateLabel: 'Konut kredisi faiz (% yıllık)',
    maturityLabel: 'Vade (yıl)',
    maintenanceLabel: 'Aylık bakım + aidat (₺)',
    propertyTaxLabel: 'Emlak vergisi (%)',
    rentIncLabel: 'Beklenen yıllık kira artışı (%)',
    appreciationLabel: 'Beklenen konut değer artışı (%)',
    investLabel: 'Beklenen yatırım getirisi – reel (%)',
    inflationLabel: 'Enflasyon (%)',
    usdTryLabel: 'USD/TRY kuru',
    simCountLabel: 'Simülasyon yolu',
    currencyLabel: 'Gösterim birimi',
    nominalTRY: 'Nominal TRY',
    realTRY: 'Reel TRY',
    usdRef: 'USD Referans',
    runBtn: 'Simülasyonu Çalıştır',
    running: 'Hesaplanıyor…',
    exportBtn: 'CSV İndir',
    langLabel: 'Dil',
    darkMode: 'Karanlık Mod',
    lightMode: 'Aydınlık Mod',
    nwChartTitle: 'Net Varlık Zaman Serisi (Ortanca ± P10/P90)',
    distChartTitle: '10/20/30. Yıl Sonuç Dağılımı (Satın Al − Kirala)',
    sensChartTitle: 'Duyarlılık Analizi — 30. Yıl Ortanca Fark',
    disclaimer: 'Bu araç yalnızca bilgilendirme amaçlıdır; yatırım veya finansal danışmanlık değildir. Veriler TÜİK, Endeksa, Sahibinden ve TCMB göstergelerinin aylık önbelleklenmiş yaklaşık değerleriyle oluşturulmuştur; canlı API olmadığında bu değerler kullanılır.',
    beatProb: 'Satın almanın üstün gelme olasılığı',
    breakevenMedian: 'Breakeven yıl (ortanca)',
    breakevenCI: 'Breakeven güven aralığı',
    p10p90: '30. yıl fark P10–P90',
    sensKeys: {
      homePrice: 'Konut Fiyatı',
      monthlyRent: 'Aylık Kira',
      downPaymentPct: 'Peşinat %',
      mortgageRate: 'Kredi Faizi',
      homeAppreciation: 'Değer Artışı',
      rentIncrease: 'Kira Artışı',
      investmentReturn: 'Yatırım Getirisi',
      inflation: 'Enflasyon',
    },
    validationErrors: {
      homePrice: 'Konut fiyatı sıfırdan büyük olmalı',
      monthlyRent: 'Aylık kira sıfırdan büyük olmalı',
      downPayment: 'Peşinat 0–100 arasında olmalı',
      loanYears: 'Vade sıfırdan büyük olmalı',
      usdTry: 'USD/TRY kuru sıfırdan büyük olmalı',
      simCount: 'Simülasyon yolu en az 1.000 olmalı',
    },
  },
  en: {
    title: 'Rent vs Buy (Turkey)',
    subtitle: '30-year Monte Carlo simulation comparison',
    inputTitle: 'Inputs',
    resultsTitle: 'Results',
    cityLabel: 'District',
    homePriceLabel: 'Home price (₺)',
    rentLabel: 'Monthly rent (₺)',
    downPaymentLabel: 'Down payment (%)',
    mortgageRateLabel: 'Mortgage rate (% annual)',
    maturityLabel: 'Loan term (years)',
    maintenanceLabel: 'Monthly maintenance + dues (₺)',
    propertyTaxLabel: 'Property tax (%)',
    rentIncLabel: 'Expected annual rent growth (%)',
    appreciationLabel: 'Expected home appreciation (%)',
    investLabel: 'Expected investment return – real (%)',
    inflationLabel: 'Inflation (%)',
    usdTryLabel: 'USD/TRY rate',
    simCountLabel: 'Simulation paths',
    currencyLabel: 'Display unit',
    nominalTRY: 'Nominal TRY',
    realTRY: 'Real TRY',
    usdRef: 'USD Reference',
    runBtn: 'Run Simulation',
    running: 'Computing…',
    exportBtn: 'Export CSV',
    langLabel: 'Language',
    darkMode: 'Dark Mode',
    lightMode: 'Light Mode',
    nwChartTitle: 'Net Worth Time Series (Median ± P10/P90)',
    distChartTitle: 'Year 10/20/30 Outcome Distribution (Buy − Rent)',
    sensChartTitle: 'Sensitivity Analysis — Year-30 Median Difference',
    disclaimer: 'This tool is for informational purposes only and does not constitute financial advice. Data uses monthly cached approximations from TÜİK, Endeksa, Sahibinden and TCMB when live APIs are unavailable.',
    beatProb: 'Probability buying outperforms renting',
    breakevenMedian: 'Breakeven year (median)',
    breakevenCI: 'Breakeven confidence interval',
    p10p90: 'Year-30 difference P10–P90',
    sensKeys: {
      homePrice: 'Home Price',
      monthlyRent: 'Monthly Rent',
      downPaymentPct: 'Down Payment %',
      mortgageRate: 'Mortgage Rate',
      homeAppreciation: 'Home Appreciation',
      rentIncrease: 'Rent Growth',
      investmentReturn: 'Investment Return',
      inflation: 'Inflation',
    },
    validationErrors: {
      homePrice: 'Home price must be greater than zero',
      monthlyRent: 'Monthly rent must be greater than zero',
      downPayment: 'Down payment must be between 0 and 100',
      loanYears: 'Loan term must be greater than zero',
      usdTry: 'USD/TRY rate must be greater than zero',
      simCount: 'Simulation paths must be at least 1,000',
    },
  },
};

// ── State ──────────────────────────────────────────────────────────────────────
let lang = localStorage.getItem('lang') || 'tr';
let netWorthChart, distributionChart, sensitivityChart;
let activeWorker = null;
let lastResult   = null;
let lastMode     = null;

// ── DOM helpers ────────────────────────────────────────────────────────────────
const el  = id => document.getElementById(id);
const R   = {};
const FORM_IDS = [
  'districtSelect', 'homePrice', 'monthlyRent', 'downPaymentPct',
  'mortgageRate', 'loanYears', 'maintenance', 'propertyTaxPct',
  'rentIncrease', 'homeAppreciation', 'investmentReturn', 'inflation',
  'usdTry', 'simCount', 'valueMode', 'summary', 'sourceBanner',
  'runBtn', 'exportBtn',
];
FORM_IDS.forEach(id => { R[id] = el(id); });

// ── Districts ──────────────────────────────────────────────────────────────────
function fillDistricts() {
  Object.keys(DISTRICTS).forEach(key => {
    const opt = document.createElement('option');
    opt.value = opt.textContent = key;
    R.districtSelect.appendChild(opt);
  });
  R.districtSelect.addEventListener('change', applyDistrictDefaults);
}

function applyDistrictDefaults() {
  const d = DISTRICTS[R.districtSelect.value];
  if (!d) return;
  R.homePrice.value      = d.homePrice;
  R.monthlyRent.value    = d.monthlyRent;
  R.maintenance.value    = d.maintenance;
  R.propertyTaxPct.value = d.propertyTaxPct;
  R.sourceBanner.textContent =
    `Veri kaynağı: ${d.source}. Canlı API yoksa aylık cache kullanılır.`;
}

// ── Inputs ─────────────────────────────────────────────────────────────────────
function getInputs() {
  return {
    homePrice:        Number(R.homePrice.value),
    monthlyRent:      Number(R.monthlyRent.value),
    downPaymentPct:   Number(R.downPaymentPct.value),
    mortgageRate:     Number(R.mortgageRate.value),
    loanYears:        Number(R.loanYears.value),
    maintenance:      Number(R.maintenance.value),
    propertyTaxPct:   Number(R.propertyTaxPct.value),
    rentIncrease:     Number(R.rentIncrease.value),
    homeAppreciation: Number(R.homeAppreciation.value),
    investmentReturn: Number(R.investmentReturn.value),
    inflation:        Number(R.inflation.value),
    usdTry:           Number(R.usdTry.value),
    simCount:         Number(R.simCount.value),
    valueMode:        R.valueMode.value,
  };
}

function validateInputs(inp) {
  const e = STRINGS[lang].validationErrors;
  const errors = [];
  if (inp.homePrice      <= 0)               errors.push(e.homePrice);
  if (inp.monthlyRent    <= 0)               errors.push(e.monthlyRent);
  if (inp.downPaymentPct < 0 || inp.downPaymentPct > 100) errors.push(e.downPayment);
  if (inp.loanYears      <= 0)               errors.push(e.loanYears);
  if (inp.usdTry         <= 0)               errors.push(e.usdTry);
  if (inp.simCount       < 1_000)            errors.push(e.simCount);
  return errors;
}

// ── URL state persistence ─────────────────────────────────────────────────────
const URL_KEYS = [
  'homePrice', 'monthlyRent', 'downPaymentPct', 'mortgageRate', 'loanYears',
  'maintenance', 'propertyTaxPct', 'rentIncrease', 'homeAppreciation',
  'investmentReturn', 'inflation', 'usdTry', 'simCount', 'valueMode',
];

function updateURL(inp) {
  const params = new URLSearchParams();
  URL_KEYS.forEach(k => params.set(k, inp[k]));
  history.replaceState(null, '', '?' + params);
}

function loadFromURL() {
  const params = new URLSearchParams(location.search);
  let loaded = false;
  URL_KEYS.forEach(k => {
    if (params.has(k) && R[k]) {
      R[k].value = params.get(k);
      loaded = true;
    }
  });
  return loaded;
}

// ── Formatting ─────────────────────────────────────────────────────────────────
function fmt(v, mode) {
  const currency = mode === 'usd' ? 'USD' : 'TRY';
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency', currency, maximumFractionDigits: 0,
  }).format(v);
}

// ── Rendering ─────────────────────────────────────────────────────────────────
function renderSummary(res, mode) {
  const s = STRINGS[lang];
  R.summary.innerHTML = [
    [s.beatProb,        `%${res.beatProbability.toFixed(1)}`],
    [s.breakevenMedian, `${res.breakevenMedian}. yıl`],
    [s.breakevenCI,     `${res.breakevenLow} – ${res.breakevenHigh}`],
    [s.p10p90,          `${fmt(res.p10, mode)} / ${fmt(res.p90, mode)}`],
  ].map(([label, value]) =>
    `<article class="metric"><span class="label">${label}</span><span class="value">${value}</span></article>`
  ).join('');
}

function renderCharts(res, mode) {
  if (netWorthChart)    netWorthChart.destroy();
  if (distributionChart) distributionChart.destroy();

  const tick = v => fmt(v, mode);
  const BAND_HIDDEN = ['Buy P10', 'Buy P90', 'Rent P10', 'Rent P90'];

  netWorthChart = new Chart(el('netWorthChart'), {
    type: 'line',
    data: {
      labels: res.years,
      datasets: [
        // P10/P90 bands as dashed lines
        { label: 'Buy P10',  data: res.p10Buy,    borderColor: 'rgba(29,78,216,0.25)',  borderDash: [4, 4], pointRadius: 0, borderWidth: 1, fill: false, tension: 0.2 },
        { label: 'Buy P90',  data: res.p90Buy,    borderColor: 'rgba(29,78,216,0.25)',  borderDash: [4, 4], pointRadius: 0, borderWidth: 1, fill: '-1',  tension: 0.2, backgroundColor: 'rgba(29,78,216,0.07)' },
        { label: 'Buy',      data: res.medianBuy,  borderColor: '#1d4ed8', pointRadius: 0, borderWidth: 2, fill: false, tension: 0.2 },
        { label: 'Rent P10', data: res.p10Rent,   borderColor: 'rgba(5,150,105,0.25)',  borderDash: [4, 4], pointRadius: 0, borderWidth: 1, fill: false, tension: 0.2 },
        { label: 'Rent P90', data: res.p90Rent,   borderColor: 'rgba(5,150,105,0.25)',  borderDash: [4, 4], pointRadius: 0, borderWidth: 1, fill: '-1',  tension: 0.2, backgroundColor: 'rgba(5,150,105,0.07)' },
        { label: 'Rent',     data: res.medianRent, borderColor: '#059669', pointRadius: 0, borderWidth: 2, fill: false, tension: 0.2 },
      ],
    },
    options: {
      responsive: true,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { labels: { filter: item => !BAND_HIDDEN.includes(item.text) } },
      },
      scales: { y: { ticks: { callback: tick } } },
    },
  });

  distributionChart = new Chart(el('distributionChart'), {
    type: 'bar',
    data: {
      labels: ['Y10 P10', 'Y10 Med', 'Y10 P90', 'Y20 P10', 'Y20 Med', 'Y20 P90', 'Y30 P10', 'Y30 Med', 'Y30 P90'],
      datasets: [{
        label: 'Buy − Rent',
        data: [
          res.dists.y10.p10, res.dists.y10.median, res.dists.y10.p90,
          res.dists.y20.p10, res.dists.y20.median, res.dists.y20.p90,
          res.dists.y30.p10, res.dists.y30.median, res.dists.y30.p90,
        ],
        backgroundColor: ctx => ctx.raw >= 0 ? 'rgba(29,78,216,0.7)' : 'rgba(220,38,38,0.7)',
      }],
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: { y: { ticks: { callback: tick } } },
    },
  });
}

function renderSensitivity(sens, mode) {
  if (sensitivityChart) sensitivityChart.destroy();

  const sk     = STRINGS[lang].sensKeys;
  // Sort by total impact magnitude (largest swing at top of tornado)
  const sorted = [...sens.results].sort(
    (a, b) => Math.abs(b.high - b.low) - Math.abs(a.high - a.low)
  );
  const labels = sorted.map(r => sk[r.key] || r.key);
  const tick   = v => fmt(v, mode);

  sensitivityChart = new Chart(el('sensitivityChart'), {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: '−20%',
          data: sorted.map(r => r.low - sens.base),
          backgroundColor: sorted.map(r =>
            (r.low - sens.base) >= 0 ? 'rgba(29,78,216,0.65)' : 'rgba(220,38,38,0.65)'
          ),
        },
        {
          label: '+20%',
          data: sorted.map(r => r.high - sens.base),
          backgroundColor: sorted.map(r =>
            (r.high - sens.base) >= 0 ? 'rgba(29,78,216,0.85)' : 'rgba(220,38,38,0.85)'
          ),
        },
      ],
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      plugins: { legend: { display: true } },
      scales: {
        x: {
          ticks: { callback: tick },
          title: { display: true, text: 'Change vs baseline (Buy − Rent, year 30 median)' },
        },
      },
    },
  });
}

// ── CSV export ─────────────────────────────────────────────────────────────────
function exportCSV() {
  if (!lastResult) return;
  const rows = [['Year', 'Median Buy', 'P10 Buy', 'P90 Buy', 'Median Rent', 'P10 Rent', 'P90 Rent']];
  lastResult.years.forEach((y, i) => {
    rows.push([
      y,
      lastResult.medianBuy[i].toFixed(0),
      lastResult.p10Buy[i].toFixed(0),
      lastResult.p90Buy[i].toFixed(0),
      lastResult.medianRent[i].toFixed(0),
      lastResult.p10Rent[i].toFixed(0),
      lastResult.p90Rent[i].toFixed(0),
    ]);
  });
  const csv  = rows.map(r => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url;
  a.download = 'kira-vs-satin-alma.csv';
  a.click();
  URL.revokeObjectURL(url);
}

// ── Dark mode ──────────────────────────────────────────────────────────────────
function initDarkMode() {
  const saved = localStorage.getItem('darkMode');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  setDark(saved !== null ? saved === 'true' : prefersDark);
}

function setDark(on) {
  document.documentElement.toggleAttribute('data-dark', on);
  localStorage.setItem('darkMode', on);
  const btn = el('darkToggle');
  if (btn) btn.textContent = STRINGS[lang][on ? 'lightMode' : 'darkMode'];
}

// ── Language ───────────────────────────────────────────────────────────────────
// Map of element IDs to string keys (avoids a page reload for language switch)
const TEXT_MAP = [
  ['title', 'title'], ['subtitle', 'subtitle'], ['inputTitle', 'inputTitle'],
  ['resultsTitle', 'resultsTitle'], ['cityLabel', 'cityLabel'],
  ['homePriceLabel', 'homePriceLabel'], ['rentLabel', 'rentLabel'],
  ['downPaymentLabel', 'downPaymentLabel'], ['mortgageRateLabel', 'mortgageRateLabel'],
  ['maturityLabel', 'maturityLabel'], ['maintenanceLabel', 'maintenanceLabel'],
  ['propertyTaxLabel', 'propertyTaxLabel'], ['rentIncLabel', 'rentIncLabel'],
  ['appreciationLabel', 'appreciationLabel'], ['investLabel', 'investLabel'],
  ['inflationLabel', 'inflationLabel'], ['usdTryLabel', 'usdTryLabel'],
  ['simCountLabel', 'simCountLabel'], ['currencyLabel', 'currencyLabel'],
  ['nwChartTitle', 'nwChartTitle'], ['distChartTitle', 'distChartTitle'],
  ['sensChartTitle', 'sensChartTitle'], ['disclaimer', 'disclaimer'],
  ['langLabel', 'langLabel'],
];

function applyLang() {
  const s = STRINGS[lang];
  TEXT_MAP.forEach(([id, key]) => {
    const node = el(id);
    if (node) node.textContent = s[key] || '';
  });

  if (R.runBtn)    R.runBtn.textContent    = s.runBtn;
  if (R.exportBtn) R.exportBtn.textContent = s.exportBtn;

  const vm = R.valueMode;
  if (vm && vm.options.length >= 3) {
    vm.options[0].textContent = s.nominalTRY;
    vm.options[1].textContent = s.realTRY;
    vm.options[2].textContent = s.usdRef;
  }

  // Re-render charts with updated labels if results exist
  if (lastResult) {
    renderSensitivity(lastResult._sens, lastMode);
  }

  // Update dark mode button text
  const isDark = document.documentElement.hasAttribute('data-dark');
  const btn = el('darkToggle');
  if (btn) btn.textContent = s[isDark ? 'lightMode' : 'darkMode'];

  localStorage.setItem('lang', lang);
}

// ── Run (Web Worker) ───────────────────────────────────────────────────────────
function run() {
  const inp    = getInputs();
  const errors = validateInputs(inp);
  if (errors.length) { alert(errors.join('\n')); return; }

  updateURL(inp);

  if (activeWorker) {
    activeWorker.terminate();
    activeWorker = null;
  }

  const btn = R.runBtn;
  btn.disabled    = true;
  btn.textContent = STRINGS[lang].running;

  activeWorker = new Worker('simulator.worker.js');

  activeWorker.onmessage = (e) => {
    const { simulation, sensitivity } = e.data;
    lastResult        = simulation;
    lastResult._sens  = sensitivity;   // stash for language re-renders
    lastMode          = inp.valueMode;

    renderSummary(simulation, inp.valueMode);
    renderCharts(simulation, inp.valueMode);
    renderSensitivity(sensitivity, inp.valueMode);

    btn.disabled    = false;
    btn.textContent = STRINGS[lang].runBtn;
    activeWorker    = null;
  };

  activeWorker.onerror = (err) => {
    alert('Simülasyon hatası: ' + (err.message || err));
    btn.disabled    = false;
    btn.textContent = STRINGS[lang].runBtn;
    activeWorker    = null;
  };

  activeWorker.postMessage(inp);
}

// ── Init ───────────────────────────────────────────────────────────────────────
fillDistricts();
const loadedFromURL = loadFromURL();
if (!loadedFromURL) applyDistrictDefaults();

initDarkMode();
applyLang();

el('langSelect').addEventListener('change', e => {
  lang = e.target.value;
  applyLang();
});

el('darkToggle').addEventListener('click', () => {
  setDark(!document.documentElement.hasAttribute('data-dark'));
});

R.runBtn.addEventListener('click', run);
R.exportBtn.addEventListener('click', exportCSV);

run();
