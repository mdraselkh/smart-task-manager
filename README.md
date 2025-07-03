# 🧠 Smart Task Manager

A simple and powerful task management app built with **Next.js 15**, styled with **Tailwind CSS**, and powered by **Google Gemini AI** to auto-generate smart subtasks based on your input.

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/mdraselkh/smart-task-manager.git
cd smart-task-manager
```
### 2. Install dependencies

```bash
npm install
```

### 3. Add your Gemini API key
#### Create a .env.local file in the root:

```bash
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Run the development server

```bash
npm run dev
```


Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## 💻 Tech Stack
✅ Next.js 15 (App Router)

✅ Tailwind CSS

✅ ShadCN UI

✅ @tanstack/react-table


✅ Google Gemini AI API

## 🔥 Features
  Add, edit, and delete tasks

  Generate subtasks from task title & description via Gemini AI
  
  Smart table with pagination, filtering & sorting

  LocalStorage for task persistence

  Mobile responsive UI with clean UX

## ⚠️ Challenges Faced
Extracting clean subtasks from Gemini’s raw text response

Keeping localStorage data in sync with UI updates (add/edit/delete)

Creating a flexible and responsive data table

Handling task edit states and update flow properly


## 📘 Learn More

[Next.js Documentation](https://nextjs.org/docs)

[Tailwind CSS Docs](https://v2.tailwindcss.com/docs)

[Gemini AI](https://ai.google.dev/gemini-api/docs)

[Shadcn Data Table Docs](https://ui.shadcn.com/docs/components/data-table)



Made with 💙 by Rasel
