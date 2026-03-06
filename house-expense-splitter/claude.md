# n8n to App

## Purpose
Convert n8n Cloud workflows into production-ready Next.js web apps — from workflow audit through GitHub push and Vercel deployment.

## Process

1. **Audit the workflow** — Use the n8n MCP to inspect the target workflow. Ensure it has a Webhook trigger (POST, JSON body, response mode: "Using 'Respond to Webhook' Node") and a "Respond to Webhook" node returning structured JSON. Adjust nodes as needed before building.

2. **Plan the UI** — Use the frontend designer skill to define the layout, inputs, and outputs based on the workflow's data contract.

3. **Scaffold the app** — Create a new Next.js app:
   ```bash
   pnpm create next-app@latest <app-name> --typescript --tailwind --app
   ```

4. **Build the frontend** — Wire up the UI to POST user input to the n8n webhook URL (stored in `.env.local` as `NEXT_PUBLIC_WEBHOOK_URL`) and display the JSON response clearly.

5. **Test locally** — Run `pnpm dev` and verify the full round-trip (form → webhook → response display).

6. **Push to GitHub** — Use the GitHub MCP to create a new personal repo named `<app-name>`, then push the code.

7. **Deploy to Vercel** — Connect the GitHub repo to Vercel. Add `NEXT_PUBLIC_WEBHOOK_URL` as an environment variable. Future pushes to `main` auto-deploy.

---

## Tech Stack

- **Frontend:** Next.js (App Router) + React + TypeScript + Tailwind CSS
- **Package manager:** pnpm
- **Deployment:** Vercel (auto-deploy on push to `main`)
- **Backend:** n8n Cloud webhooks (no custom server needed)

---

## Tools

| Tool | Purpose |
|------|---------|
| n8n MCP | Inspect and modify n8n Cloud workflows |
| n8n skill | Node configs, templates, webhook patterns |
| Frontend designer skill | Plan UI/UX before building |
| GitHub MCP | Create repos, commit, and push code |

---

## n8n Webhook Contract

Every workflow must conform to this before building the frontend:

- **Trigger:** Webhook node — Method: `POST`, Body format: JSON, Response mode: `Using 'Respond to Webhook' Node`
- **Response:** "Respond to Webhook" node returns a structured JSON object
- **Frontend env:** `.env.local` contains `NEXT_PUBLIC_WEBHOOK_URL=<webhook-url>`

---

## Repo Convention

- One GitHub repo per app (personal account)
- Repo name: descriptive kebab-case (e.g. `email-summarizer`, `blog-post-generator`)
- Default branch: `main`
