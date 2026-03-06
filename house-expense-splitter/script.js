// ── Config ──────────────────────────────────────────────────────────────────
const WEBHOOK_URL = WEBHOOK_URL ;
const RENT = 600;
const MEAL_PLANS = {
  none: { label: "None",       cost: 0   },
  "1x": { label: "1 meal/day", cost: 150 },
  "2x": { label: "2 meals/day",cost: 250 },
  "3x": { label: "3 meals/day",cost: 350 },
};

// ── Members — add emails here ────────────────────────────────────────────────
const members = [
  { name: "Ahmed Al Farsi",   email: "pvsameerpvs@gmail.com" },
  { name: "Ravi Kumar",       email: "ttt@gmail.com" },
  { name: "Mohammed Zaid",    email: "fff@gmail.com" },
  { name: "Arjun Nair",       email: "rrr@gmail.com" },
  { name: "Priya Menon",      email: "aa@gmail.com" },
  { name: "Omar Hassan",      email: "aaa@gmail.com" },
  { name: "Deepak Sharma",    email: "aaaa@gmail.com" },
  { name: "Fatima Al Zahra",  email: "z@gmail.com" },
  { name: "Sanjay Patel",     email: "zz@gmail.com" },
  { name: "Ali Raza",         email: "zzzz@gmail.com" },
];

// ── Month helper ─────────────────────────────────────────────────────────────
function getCurrentMonth() {
  return new Date().toLocaleString("en-US", { month: "long", year: "numeric" });
}

// ── localStorage helpers ─────────────────────────────────────────────────────
function saveHouseItems(items) {
  localStorage.setItem("houseItems", JSON.stringify(items));
}
function loadHouseItems() {
  try { return JSON.parse(localStorage.getItem("houseItems")) || []; }
  catch { return []; }
}
function saveFoodSelections(selections) {
  localStorage.setItem("foodSelections", JSON.stringify(selections));
}
function loadFoodSelections() {
  try { return JSON.parse(localStorage.getItem("foodSelections")) || {}; }
  catch { return {}; }
}

// ── Payload builder ───────────────────────────────────────────────────────────
function collectPayload() {
  const month          = getCurrentMonth();
  const additionalItems = loadHouseItems();
  const foodSelections  = loadFoodSelections();

  const additionalTotal = additionalItems.reduce((s, i) => s + Number(i.amount), 0);
  const additionalShare = additionalItems.length > 0
    ? Math.round((additionalTotal / members.length) * 100) / 100
    : 0;

  const memberPayloads = members.map(m => {
    const planKey   = foodSelections[m.name] || "none";
    const plan      = MEAL_PLANS[planKey];
    const houseTotal = RENT + additionalShare;
    const grandTotal = houseTotal + plan.cost;
    return {
      name:             m.name,
      email:            m.email,
      rent_share:       RENT,
      additional_share: additionalShare,
      house_total:      houseTotal,
      meal_plan:        planKey === "none" ? "None" : planKey,
      meal_cost:        plan.cost,
      grand_total:      grandTotal,
    };
  });

  return {
    month,
    additional_items: additionalItems.map(i => ({
      item:   i.item,
      amount: Number(i.amount),
    })),
    members: memberPayloads,
  };
}

// ── Send bills ────────────────────────────────────────────────────────────────
async function sendBills(statusCells) {
  if (WEBHOOK_URL === "PASTE_YOUR_WEBHOOK_URL_HERE") {
    alert("Please set your webhook URL in script.js first.");
    return;
  }

  const payload = collectPayload();

  // Mark all as sending
  statusCells.forEach(cell => {
    cell.textContent = "⏳";
    cell.className = "status-col status-sending";
  });

  try {
    const res = await fetch(WEBHOOK_URL, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(payload),
    });

    if (res.ok) {
      statusCells.forEach(cell => {
        cell.textContent = "✅";
        cell.className = "status-col status-sent";
      });
    } else {
      throw new Error(`HTTP ${res.status}`);
    }
  } catch (err) {
    statusCells.forEach(cell => {
      cell.textContent = "❌";
      cell.className = "status-col status-failed";
    });
    console.error("Webhook error:", err);
  }
}
