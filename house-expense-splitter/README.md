# House Expense Splitter

A 2-page static site for splitting house bills and food mess costs among 10 housemates. One combined Gmail per member sent via n8n.

---

## Files

| File | Purpose |
|------|---------|
| `index.html` | House Bill page |
| `food.html` | Food Mess page |
| `style.css` | Shared styles |
| `script.js` | Members, logic, webhook call |

---

## Setup Steps

### 1. Add Member Emails

Open `script.js` and fill in each member's email:

```js
const members = [
  { name: "Ahmed Al Farsi",  email: "ahmed@gmail.com" },
  { name: "Ravi Kumar",      email: "ravi@gmail.com" },
  // ...
];
```

### 2. Import the n8n Workflow

1. Open your n8n instance
2. Go to **Workflows → house-expense-tracker**
   (It was created automatically via the n8n MCP)
3. If you need to import manually: go to **Workflows → Import** and paste the workflow JSON

### 3. Connect Gmail OAuth2

1. In n8n, open the **house-expense-tracker** workflow
2. Click the **Gmail** node
3. Under Credentials, click **Create new** → select **Gmail OAuth2**
4. Follow the OAuth2 flow to connect your Gmail account
5. Save the node

### 4. Activate the Workflow

1. Toggle the workflow to **Active** (top-right switch in n8n)
2. Copy the **Webhook URL** shown in the Webhook node (Production URL)

### 5. Paste the Webhook URL

Open `script.js` and replace the placeholder:

```js
const WEBHOOK_URL = "https://justsearchweb.app.n8n.cloud/webhook/house-expense";
```

### 6. Open the Site

Open `index.html` in a browser (double-click or use Live Server in VS Code).

> **Note:** The Send Bills button uses `fetch()` to call the webhook. Open from a local server or browser — it works fine opened directly as a file in most browsers.

---

## How It Works

### House Bill (`index.html`)
- Fixed rent: **600 AED** per person
- Add itemized shared expenses (water, tissue, etc.)
- Additional total is split equally across all 10 members
- Live table shows each person's House Total

### Food Mess (`food.html`)
- Each person picks their own meal plan independently
- No splitting — each person pays their own plan cost
- Plans: None (0) / 1x (150 AED) / 2x (250 AED) / 3x (350 AED)

### Send Bills
- Clicking **Send Bills** on either page collects data from **both** pages (via localStorage)
- Sends a single POST to your n8n webhook
- n8n loops over all members and sends one combined email per person
- Status shows ✅ / ❌ per member inline

---

## Email Format

```
Hi Ahmed Al Farsi,

Here is your bill for March 2026:

🏠 HOUSE BILL
─────────────────────────────
Rent Share:           600 AED
Additional Share:      75 AED
  • Water: 300 AED
  • Tissue: 100 AED
  • Cleaning: 350 AED
House Total:          675 AED

🍽️ FOOD MESS
─────────────────────────────
Meal Plan (2x):       250 AED

💰 GRAND TOTAL:       925 AED

Please pay by the 5th. Thank you!

— House Admin
```

---

## Monthly Reset

At the start of each month:
1. Open browser DevTools → Application → Local Storage
2. Clear `houseItems` and `foodSelections`
3. Or simply open the Console and run:
   ```js
   localStorage.removeItem("houseItems");
   localStorage.removeItem("foodSelections");
   location.reload();
   ```
