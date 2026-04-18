# 🦊 CodeFox — AI-Powered Code Review Engine

> Automated, intelligent code reviews delivered directly to your GitHub Pull Requests — powered by Gemini embeddings, Pinecone vector search, and Next.js.



---

## 🧠 What is CodeFox?

**CodeFox** is a self-hosted AI code review engine that integrates seamlessly with your GitHub repositories. When a Pull Request is opened, CodeFox automatically analyzes the diff against your indexed codebase using semantic vector search, runs it through Gemini's comparative analysis, and posts a structured review comment directly on the PR — identifying bugs, improvements, and style violations before a human ever looks at it.

---

## ✨ Features

- 🔗 **GitHub Webhook Integration** — Listens for PR events in real time via Octokit
- 🧬 **Semantic Code Indexing** — Uses Gemini Embedding Model to transform code into mathematical vectors
- 🗄️ **Pinecone Vector Storage** — High-speed retrieval of contextually relevant codebase sections
- 🤖 **Gemini Comparative Analysis** — Compares PR diffs against the existing indexed codebase to surface bugs, improvements, and style violations
- 💬 **Automated PR Comments** — Posts AI-generated reviews directly on the GitHub PR page
- 🗃️ **Neon Postgres Persistence** — Stores all review history and logs for accountability and auditing
- ⚡ **Next.js App Router** — Modern, performant full-stack framework powering the dashboard and API routes

---

## 🏗️ Architecture Overview

CodeFox operates in two phases:

### Phase 1: Repository Onboarding & Indexing

| Step | Component | Description |
|------|-----------|-------------|
| 1 | **User Dashboard** | Authenticate and connect GitHub repositories for monitoring |
| 2 | **GitHub Webhook** | Establishes a secure Webhook via Octokit for real-time repo events |
| 3 | **Semantic Indexing** | Background job scans the repo and uses Gemini Embeddings to vectorize code |
| 4 | **Pinecone DB** | Generated vector index files are stored for high-speed contextual retrieval |

### Phase 2: Automated Review Logic & Output

| Step | Component | Description |
|------|-----------|-------------|
| 5 | **PR Trigger** | System wakes on a new GitHub Pull Request event |
| 6 | **Contextual Retrieval** | Pinecone is queried for indexed sections related to the PR diff |
| 7 | **Gemini Analysis** | Gemini compares the PR diff against the retrieved codebase context |
| 8 | **GitHub PR Output** | Final AI review is posted as a comment/suggestion on the PR |
| 9 | **Neon Postgres** | Review data and logs are persisted for history and accountability |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js 14+](https://nextjs.org/) (App Router) |
| AI Model | [Google Gemini](https://ai.google.dev/) (Embeddings + Generation) |
| Vector DB | [Pinecone](https://www.pinecone.io/) |
| GitHub Integration | [Octokit](https://github.com/octokit/octokit.js) |
| Database | [Neon Postgres](https://neon.tech/) |
| Auth | NextAuth.js / GitHub OAuth |
| Deployment | Vercel / Self-hosted |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- A GitHub account with permission to create Webhooks
- A [Google AI Studio](https://aistudio.google.com/) API key (for Gemini)
- A [Pinecone](https://www.pinecone.io/) account and index
- A [Neon](https://neon.tech/) Postgres database


### Set Up GitHub Webhook

1. Go to your GitHub repository → **Settings** → **Webhooks** → **Add webhook**
2. Set the **Payload URL** to `https://your-domain.com/api/webhooks/github`
3. Set **Content type** to `application/json`
4. Add your **Webhook Secret** (matching `GITHUB_WEBHOOK_SECRET`)
5. Select **Pull requests** as the event trigger

---

## 📁 Project Structure

```
codefox/
├── app/
│   ├── api/
│   │   ├── webhooks/
│   │   │   └── github/        # Webhook receiver & PR trigger
│   │   ├── index/             # Repository indexing endpoints
│   │   └── reviews/           # Review history API
│   ├── dashboard/             # User dashboard UI
│   └── layout.tsx
├── lib/
│   ├── gemini/
│   │   ├── embeddings.ts      # Gemini embedding generation
│   │   └── review.ts          # Gemini comparative analysis
│   ├── pinecone/
│   │   ├── client.ts          # Pinecone client setup
│   │   ├── index.ts           # Upsert & query helpers
│   └── github/
│       ├── octokit.ts         # Octokit client & webhook handlers
│       └── pr.ts              # PR diff extraction & comment posting
├── db/
│   ├── schema.ts              # Neon Postgres schema (Drizzle ORM)
│   └── migrations/
├── components/                # Shared UI components
└── public/
```

---

## ⚙️ How Indexing Works

When a repository is connected, CodeFox runs a background indexing job:

1. Clones or fetches the repository contents via Octokit
2. Chunks the code files into meaningful segments
3. Sends each chunk to the **Gemini Embedding API** to generate a vector
4. Upserts all vectors into **Pinecone** with metadata (file path, line range, language)

```typescript
// lib/gemini/embeddings.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "models/embedding-001" });

export async function embedCode(content: string): Promise<number[]> {
  const result = await model.embedContent(content);
  return result.embedding.values;
}
```

---

## 🔍 How PR Review Works

When a Pull Request is opened:

1. **Octokit** receives the webhook event and extracts the diff
2. The diff is embedded using Gemini and used to **query Pinecone** for similar indexed sections
3. The PR diff + retrieved context is sent to **Gemini** for comparative analysis
4. Gemini returns a structured review (bugs, improvements, style violations)
5. The review is posted as a **GitHub PR comment** via Octokit
6. The review record is saved to **Neon Postgres**

---

## 📊 Dashboard

The CodeFox dashboard (built with Next.js App Router) provides:

- Repository connection and management
- Indexing status and progress
- Review history and logs per repository
- PR-level review details with diff context

---

## 🤝 Contributing

Contributions are welcome! Please open an issue first to discuss what you'd like to change.

1. Fork the repo
2. Create your branch: `git checkout -b feat/your-feature`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push to the branch: `git push origin feat/your-feature`
5. Open a Pull Request (CodeFox will review it automatically 🦊)

---

## 📄 License

[MIT](./LICENSE)

---

## 🙏 Acknowledgements

- [Google Gemini](https://ai.google.dev/) for embeddings and generative AI
- [Pinecone](https://www.pinecone.io/) for vector database infrastructure
- [Octokit](https://octokit.github.io/rest.js/) for GitHub API integration
- [Neon](https://neon.tech/) for serverless Postgres
- [Next.js](https://nextjs.org/) by Vercel

---

<p align="center">Built with ❤️ by the dev18 </p>
