# RevAI — AI-Powered Code Review Assistant

[![React](https://img.shields.io/badge/React-18-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC.svg)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF.svg)](https://vitejs.dev/)
[![Qwen2.5-Coder](https://img.shields.io/badge/Model-Qwen2.5--Coder%207B-purple.svg)](https://github.com/QwenLM/Qwen2.5-Coder)

An intelligent developer-focused SaaS frontend that uses **Qwen2.5-Coder 7B** to pre-review pull requests, catch security vulnerabilities (SQL injection, hardcoded credentials, buffer flaws), detect performance bottlenecks (N+1 queries, unbuffered goroutines), and provide instant unified diff suggestions before managers manually review code.

---

## Key Features

### 1. Dual Persona Experiences
- **Manager Experience**: Engineering Director dashboard to triage pull requests, review AI risk scoring, inspect problematic lines, and approve or request changes with structured feedback.
- **Developer Experience**: Fast pre-review feedback console, 1-click copyable code patches, live AI scan simulator, and connected repository statuses.

### 2. Comprehensive AI Review Details
- **Automated Code Summary**: Plain-language functional overview of what the code does.
- **Risk Assessment Meter**: Composite score (e.g. 84/100 High Risk) with critical/warning breakdown.
- **Interactive Code Viewer**: Line numbers, color-coded problematic line highlights, expandable inline annotations, and a unified diff mode comparing vulnerable implementations with AI-recommended fixes.
- **Actionable Issue Cards**: Explanations, severity tags, CWE mappings, "Why this is a problem" callouts, and suggested patches.

### 3. Manager Actions & Triage
- One-click PR Approval and Change Request modals.
- Inline comment thread with developer notification triggers.
- Filter submissions by Pending, Completed, Critical Risk, Developer, or Repository.

---

## Tech Stack
- **Frontend**: React 18, Vite, TypeScript
- **Styling**: Tailwind CSS (dark theme by default: charcoal surfaces, electric blue and subtle purple accents)
- **Icons**: Lucide React
- **Visualizations**: Recharts for daily review activity and severity breakdowns
- **Routing**: React Router v6

---

## Getting Started

### Installation
```bash
# Clone the repository
git clone https://github.com/nikhilaryan6115-design/ai-code-review-assistant.git

# Navigate into directory
cd ai-code-review-assistant

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build
```bash
npm run build
npm run preview
```
