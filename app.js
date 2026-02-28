const districtData = {
  "İstanbul / Kadıköy": {
    homePrice: 7800000,
    monthlyRent: 42000,
    maintenance: 2500,
    propertyTaxPct: 0.22,
    source: "TÜİK + Endeksa aylık önbellek (2026-01)"
  },
  "Ankara / Çankaya": {
    homePrice: 4800000,
    monthlyRent: 30000,
    maintenance: 1800,
    propertyTaxPct: 0.2,
    source: "TÜİK + Sahibinden endeksi önbellek (2026-01)"
  },
  "İzmir / Karşıyaka": {
    homePrice: 5200000,
    monthlyRent: 32000,
    maintenance: 1700,
    propertyTaxPct: 0.2,
    source: "Endeksa + TCMB bölgesel seri önbellek (2026-01)"
  },
  "Bursa / Nilüfer": {
    homePrice: 3600000,
    monthlyRent: 23000,
    maintenance: 1300,
    propertyTaxPct: 0.18,
    source: "TÜİK + yerel ilan ortalama önbellek (2026-01)"
  }
};

const el = (id) => document.getElementById(id);
const ids = [
  "districtSelect", "homePrice", "monthlyRent", "downPaymentPct", "mortgageRate", "loanYears",
  "maintenance", "propertyTaxPct", "rentIncrease", "homeAppreciation", "investmentReturn",
  "inflation", "simCount", "valueMode", "summary", "sourceBanner"
];
const refs = Object.fromEntries(ids.map((id) => [id, el(id)]));

let netWorthChart;
let distributionChart;

function fillDistricts() {
  Object.keys(districtData).forEach((key) => {
    const option = document.createElement("option");
    option.value = key;
    option.textContent = key;
    refs.districtSelect.appendChild(option);
  });
  refs.districtSelect.addEventListener("change", applyDistrictDefaults);
  applyDistrictDefaults();
}

function applyDistrictDefaults() {
  const data = districtData[refs.districtSelect.value];
  refs.homePrice.value = data.homePrice;
  refs.monthlyRent.value = data.monthlyRent;
  refs.maintenance.value = data.maintenance;
  refs.propertyTaxPct.value = data.propertyTaxPct;
  refs.sourceBanner.textContent = `Veri kaynağı: ${data.source}. Canlı API yoksa aylık cache kullanılır.`;
}

function randn() {
  const u = 1 - Math.random();
  const v = 1 - Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function p(arr, q) {
  const s = [...arr].sort((a, b) => a - b);
  const idx = Math.floor((s.length - 1) * q);
  return s[idx];
}

function mortgagePayment(principal, monthlyRate, months) {
  if (monthlyRate === 0) return principal / months;
  const x = (1 + monthlyRate) ** months;
  return principal * (monthlyRate * x) / (x - 1);
}

function simulate(inputs) {
  const years = 30;
  const sims = Math.max(10000, Number(inputs.simCount));
  const buySeries = Array.from({ length: years + 1 }, () => []);
  const rentSeries = Array.from({ length: years + 1 }, () => []);
  const diffY10 = [];
  const diffY20 = [];
  const diffY30 = [];
  const beats = [];
  const breakevens = [];

  for (let s = 0; s < sims; s++) {
    let homeValue = inputs.homePrice;
    let rent = inputs.monthlyRent;
    let maintenance = inputs.maintenance * 12;
    const down = inputs.homePrice * (inputs.downPaymentPct / 100);
    let investment = down;
    const principal = inputs.homePrice - down;
    const monthlyRate = inputs.mortgageRate / 100;
    const loanMonths = inputs.loanYears * 12;
    const mPay = mortgagePayment(principal, monthlyRate, loanMonths);
    let balance = principal;
    let inflationIndex = 1;
    let usdTry = 34;
    let firstBreakeven = null;

    for (let y = 0; y <= years; y++) {
      const saleCost = homeValue * 0.05;
      const buyNet = homeValue - balance - saleCost;
      const rentNet = investment;
      const displayBuy = valueTransform(buyNet, inflationIndex, usdTry, inputs.valueMode);
      const displayRent = valueTransform(rentNet, inflationIndex, usdTry, inputs.valueMode);

      buySeries[y].push(displayBuy);
      rentSeries[y].push(displayRent);

      if (firstBreakeven === null && displayBuy > displayRent) firstBreakeven = y;
      if (y === 10) diffY10.push(displayBuy - displayRent);
      if (y === 20) diffY20.push(displayBuy - displayRent);
      if (y === 30) {
        const finalDiff = displayBuy - displayRent;
        diffY30.push(finalDiff);
        beats.push(finalDiff > 0 ? 1 : 0);
      }

      if (y === years) continue;

      const inflationShock = Math.max(-0.15, (inputs.inflation / 100) + 0.08 * randn());
      inflationIndex *= (1 + inflationShock);
      usdTry *= 1 + Math.max(0, inflationShock - 0.03);

      const appShock = (inputs.homeAppreciation / 100) + 0.18 * randn();
      homeValue *= Math.max(0.65, 1 + appShock);

      const rentRegimeBoost = Math.random() < 0.1 ? 0.15 : 0;
      const rentShock = (inputs.rentIncrease / 100) + rentRegimeBoost + 0.12 * randn();
      rent *= Math.max(0.7, 1 + rentShock);

      maintenance *= 1 + Math.max(0, inflationShock - 0.02);

      let annualMortgage = 0;
      for (let m = 0; m < 12; m++) {
        if (y * 12 + m < loanMonths && balance > 0) {
          const interest = balance * monthlyRate;
          const principalPaid = Math.min(balance, mPay - interest);
          balance -= principalPaid;
          annualMortgage += principalPaid + interest;
        }
      }

      const annualPropertyTax = homeValue * (inputs.propertyTaxPct / 100);
      const buyOutflow = annualMortgage + annualPropertyTax + maintenance;
      const rentOutflow = rent * 12;
      const deltaSavings = buyOutflow - rentOutflow;

      const invNominalReturn = (inputs.investmentReturn / 100) + inflationShock + 0.12 * randn();
      investment = Math.max(0, investment * (1 + invNominalReturn) + deltaSavings);
    }

    breakevens.push(firstBreakeven === null ? years : firstBreakeven);
  }

  const medianBuy = buySeries.map((arr) => p(arr, 0.5));
  const medianRent = rentSeries.map((arr) => p(arr, 0.5));

  return {
    years: Array.from({ length: 31 }, (_, i) => i),
    medianBuy,
    medianRent,
    p10: p(diffY30, 0.1),
    p90: p(diffY30, 0.9),
    beatProbability: (beats.reduce((a, b) => a + b, 0) / beats.length) * 100,
    breakevenMedian: p(breakevens, 0.5),
    breakevenLow: p(breakevens, 0.1),
    breakevenHigh: p(breakevens, 0.9),
    dists: {
      y10: summarizeDist(diffY10),
      y20: summarizeDist(diffY20),
      y30: summarizeDist(diffY30)
    }
  };
}

function summarizeDist(values) {
  return { p10: p(values, 0.1), median: p(values, 0.5), p90: p(values, 0.9) };
}

function valueTransform(value, inflationIndex, usdTry, mode) {
  if (mode === "real") return value / inflationIndex;
  if (mode === "usd") return value / usdTry;
  return value;
}

function fmt(v, mode) {
  const currency = mode === "usd" ? "USD" : "TRY";
  return new Intl.NumberFormat("tr-TR", { style: "currency", currency, maximumFractionDigits: 0 }).format(v);
}

function renderSummary(res, mode) {
  refs.summary.innerHTML = [
    ["Satın almanın üstün gelme olasılığı", `%${res.beatProbability.toFixed(1)}`],
    ["Breakeven yıl (medyan)", `${res.breakevenMedian}. yıl`],
    ["Breakeven güven aralığı", `${res.breakevenLow} - ${res.breakevenHigh}`],
    ["30. yıl fark P10-P90", `${fmt(res.p10, mode)} / ${fmt(res.p90, mode)}`]
  ].map(([label, value]) => `<article class="metric"><span class="label">${label}</span><span class="value">${value}</span></article>`).join("");
}

function renderCharts(res, mode) {
  if (netWorthChart) netWorthChart.destroy();
  if (distributionChart) distributionChart.destroy();

  netWorthChart = new Chart(el("netWorthChart"), {
    type: "line",
    data: {
      labels: res.years,
      datasets: [
        { label: "Buy", data: res.medianBuy, borderColor: "#1d4ed8", tension: 0.2 },
        { label: "Rent", data: res.medianRent, borderColor: "#059669", tension: 0.2 }
      ]
    },
    options: {
      responsive: true,
      interaction: { mode: "index", intersect: false },
      plugins: { legend: { display: true } },
      scales: {
        y: { ticks: { callback: (v) => fmt(v, mode) } }
      }
    }
  });

  distributionChart = new Chart(el("distributionChart"), {
    type: "bar",
    data: {
      labels: ["Y10 P10", "Y10 Med", "Y10 P90", "Y20 P10", "Y20 Med", "Y20 P90", "Y30 P10", "Y30 Med", "Y30 P90"],
      datasets: [{
        label: "Buy - Rent",
        data: [
          res.dists.y10.p10, res.dists.y10.median, res.dists.y10.p90,
          res.dists.y20.p10, res.dists.y20.median, res.dists.y20.p90,
          res.dists.y30.p10, res.dists.y30.median, res.dists.y30.p90
        ],
        backgroundColor: "#93c5fd"
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        y: { ticks: { callback: (v) => fmt(v, mode) } }
      }
    }
  });
}

function run() {
  const inputs = {
    homePrice: Number(refs.homePrice.value),
    monthlyRent: Number(refs.monthlyRent.value),
    downPaymentPct: Number(refs.downPaymentPct.value),
    mortgageRate: Number(refs.mortgageRate.value),
    loanYears: Number(refs.loanYears.value),
    maintenance: Number(refs.maintenance.value),
    propertyTaxPct: Number(refs.propertyTaxPct.value),
    rentIncrease: Number(refs.rentIncrease.value),
    homeAppreciation: Number(refs.homeAppreciation.value),
    investmentReturn: Number(refs.investmentReturn.value),
    inflation: Number(refs.inflation.value),
    simCount: Number(refs.simCount.value),
    valueMode: refs.valueMode.value
  };

  const result = simulate(inputs);
  renderSummary(result, inputs.valueMode);
  renderCharts(result, inputs.valueMode);
}

const trToEn = {
  title: "Rent vs Buy (Turkey)",
  subtitle: "30-year Monte Carlo simulation",
  inputTitle: "Inputs",
  resultsTitle: "Results",
  runBtn: "Run Simulation",
  disclaimer: "This tool is for informational purposes only and does not constitute financial advice. Data uses monthly cached approximations from TÜİK, Endeksa, Sahibinden and TCMB when live APIs are unavailable."
};

el("langSelect").addEventListener("change", (e) => {
  if (e.target.value === "en") {
    Object.entries(trToEn).forEach(([id, text]) => { if (el(id)) el(id).textContent = text; });
  } else {
    location.reload();
  }
});

el("runBtn").addEventListener("click", run);
fillDistricts();
run();
