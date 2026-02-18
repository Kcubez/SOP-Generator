# 📄 SOP Generator

A professional **AI-powered Standard Operating Procedure (SOP) Generator** built with Next.js and Google Gemini. Create new SOPs from scratch or modify existing ones with intelligent analysis, real-time editing, and instant PDF export.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma)
![Gemini](https://img.shields.io/badge/Google_Gemini-2.5_Flash-4285F4?logo=google)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss)

---

## ✨ Features

### 🤖 AI-Powered SOP Generation

- **Create New SOPs** — Fill in business details, scope, procedures, and compliance requirements. Gemini AI generates a complete, professionally formatted SOP document.
- **Modify Existing SOPs** — Upload a PDF or Word document (.pdf, .doc, .docx), describe the problems or changes needed, and the AI will intelligently modify it while preserving original dates and structure.

### ✏️ Real-Time Editable Preview

- **Inline Editing** — Click directly on the generated document to edit text, tables, and headings.
- **Auto-Save** — Changes are automatically saved 2 seconds after you stop typing, with visual status indicators (Auto-saving... → Saved!).
- **Editable Title** — Click the document title to rename it inline.

### 📥 PDF Export

- **One-Click Download** — Export your SOP as a professionally formatted PDF.
- **Consistent Typography** — Uses Inter font family across all generated documents.
- **Clean Layout** — Proper margins, styled tables with colored headers, and intelligent page breaks.

### 🌐 Bilingual Support

- **English & Myanmar (မြန်မာ)** — Full UI translation with language persistence across sessions.
- **Language Switcher** — Toggle between languages from the navbar; preference saved to localStorage.

### 👤 User Management

- **Role-Based Access** — Admin and User roles with separate dashboards.
- **Personal API Keys** — Users can configure their own Gemini API key for SOP generation.
- **Secure Authentication** — Powered by NextAuth.js with credential-based login.

### 🛡️ Admin Panel

- **User Management** — View, create, edit, and delete users.
- **SOP Overview** — Monitor all generated SOPs across the platform.
- **Role Assignment** — Promote or demote users between Admin and User roles.

---

## 🛠️ Tech Stack

| Layer          | Technology                                                   |
| -------------- | ------------------------------------------------------------ |
| **Framework**  | [Next.js 16](https://nextjs.org/) (App Router)               |
| **Language**   | [TypeScript 5](https://www.typescriptlang.org/)              |
| **Styling**    | [Tailwind CSS 4](https://tailwindcss.com/)                   |
| **AI Model**   | [Google Gemini 2.5 Flash](https://ai.google.dev/)            |
| **Database**   | [PostgreSQL](https://www.postgresql.org/) (Supabase)         |
| **ORM**        | [Prisma 7](https://www.prisma.io/) with `@prisma/adapter-pg` |
| **Auth**       | [NextAuth.js v5](https://next-auth.js.org/)                  |
| **PDF Export** | [html2pdf.js](https://ekoopmans.github.io/html2pdf.js/)      |
| **Icons**      | [Lucide React](https://lucide.dev/)                          |
| **Hosting**    | [Vercel](https://vercel.com/)                                |

---

## 📁 Project Structure

```
SOP Generator/
├── prisma/
│   ├── schema.prisma          # Database schema (User, SOP models)
│   └── seed.ts                # Database seeding script
├── public/
│   └── flags/                 # Language flag icons
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── admin/         # Admin API routes
│   │   │   ├── auth/          # NextAuth API routes
│   │   │   ├── sop/           # SOP CRUD + AI generation
│   │   │   │   ├── route.ts   # POST: Generate/Modify SOPs
│   │   │   │   └── [id]/route.ts  # GET, DELETE, PATCH individual SOPs
│   │   │   └── user/          # User API (API key management)
│   │   ├── admin/             # Admin dashboard pages
│   │   │   ├── login/         # Admin login
│   │   │   └── page.tsx       # Admin panel (user/SOP management)
│   │   ├── dashboard/
│   │   │   ├── sop/
│   │   │   │   ├── new/       # New SOP generation form
│   │   │   │   ├── modify/    # Modify existing SOP form
│   │   │   │   └── [id]/      # SOP detail (editable preview)
│   │   │   ├── sops/          # SOP list with search & filters
│   │   │   ├── layout.tsx     # Dashboard layout with navbar
│   │   │   └── page.tsx       # Dashboard home
│   │   ├── login/             # User login page
│   │   ├── globals.css        # Global styles + SOP preview CSS
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Landing page
│   ├── components/
│   │   ├── Navbar.tsx         # Navigation with auth, language switch
│   │   ├── LanguageSwitcher.tsx
│   │   └── Providers.tsx      # Session provider wrapper
│   ├── contexts/
│   │   └── LanguageContext.tsx # i18n context with localStorage
│   ├── lib/
│   │   ├── auth.ts            # NextAuth configuration
│   │   ├── prisma.ts          # Prisma client with connection pooling
│   │   └── i18n/
│   │       ├── en.ts          # English translations
│   │       └── mm.ts          # Myanmar translations
│   └── generated/prisma/      # Auto-generated Prisma client
├── .env                       # Environment variables
├── package.json
├── tsconfig.json
└── next.config.ts
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or later
- [PostgreSQL](https://www.postgresql.org/) database (or [Supabase](https://supabase.com/))
- [Google AI API Key](https://aistudio.google.com/apikey) for Gemini

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/sop-generator.git
cd sop-generator
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root:

```env
# Database (PostgreSQL / Supabase)
DATABASE_URL="postgresql://user:password@host:5432/database"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"   # Generate with: openssl rand -base64 32

# Google Gemini AI
GEMINI_API_KEY="your-gemini-api-key"
```

### 4. Set Up the Database

```bash
# Push schema to database
npx prisma db push

# Seed default admin user
npm run db:seed
```

### 5. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the app.

---

## 🔑 Default Credentials

After running the seed script:

| Role  | Email             | Password |
| ----- | ----------------- | -------- |
| Admin | admin@example.com | admin123 |

> ⚠️ **Important:** Change the default admin password immediately in production.

---

## 🌍 Deployment (Vercel)

### 1. Push to GitHub

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2. Import to Vercel

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click **"Add New" → "Project"**
3. Import your GitHub repository

### 3. Configure Environment Variables

Add the following in Vercel's **Settings → Environment Variables**:

| Variable          | Value                             |
| ----------------- | --------------------------------- |
| `DATABASE_URL`    | Your PostgreSQL connection string |
| `NEXTAUTH_URL`    | `https://your-app.vercel.app`     |
| `NEXTAUTH_SECRET` | Your generated secret key         |
| `GEMINI_API_KEY`  | Your Google AI API key            |

### 4. Deploy

Click **Deploy** — Vercel will auto-detect Next.js and use:

- **Build Command:** `npx prisma generate && next build`
- **Install Command:** `npm install`

---

## 📜 Available Scripts

| Script              | Description                                   |
| ------------------- | --------------------------------------------- |
| `npm run dev`       | Start development server                      |
| `npm run build`     | Generate Prisma client & build for production |
| `npm run start`     | Start production server                       |
| `npm run lint`      | Run ESLint                                    |
| `npm run db:push`   | Push Prisma schema to database                |
| `npm run db:seed`   | Seed database with default admin user         |
| `npm run db:studio` | Open Prisma Studio (database GUI)             |

---

## 📋 Database Schema

### User

| Field          | Type    | Description               |
| -------------- | ------- | ------------------------- |
| `id`           | String  | Unique identifier (cuid)  |
| `name`         | String  | User's display name       |
| `email`        | String  | Unique email address      |
| `password`     | String  | Hashed password           |
| `role`         | Enum    | `USER` or `ADMIN`         |
| `geminiApiKey` | String? | Optional personal API key |

### SOP

| Field              | Type    | Description               |
| ------------------ | ------- | ------------------------- |
| `id`               | String  | Unique identifier (cuid)  |
| `type`             | Enum    | `NEW` or `MODIFIED`       |
| `title`            | String  | SOP document title        |
| `generatedContent` | String  | AI-generated HTML content |
| `businessName`     | String? | Company/business name     |
| `userId`           | String  | Creator's user ID         |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

<p align="center">
  Built with ❤️ using Next.js & Google Gemini AI
</p>
