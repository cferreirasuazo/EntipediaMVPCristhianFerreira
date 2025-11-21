# Entipedia Technical Evaluation

The purpose of this project is to evaluate my technical skills with the technologies used in Entipedia.

## 🧩 Features

### **Header**

- Displays the Entipedia company name across the app.

### **Sections**

Each section includes full **CRUD** capabilities (Create, Read, Update, Delete):

#### **Projects**

Manage project records with structured forms and listings.

#### **Clients**

Create and maintain client entries.

#### **Files**

Upload, list, update, and delete file records.

---

## 🛠️ Tech Stack

### **Core Stack**

- **React**
- **Next.js**
- **TypeScript**

### **Database**

- **PostgreSQL**
- **Drizzle ORM**

### **Validation**

- **Zod**

---

## 📂 Project Structure

```
/
├── .github/                 # GitHub workflows (CI/CD)
├── .next/                   # Next.js build output
├── .sst/                    # SST build artifacts
├── app/                     # Next.js App Router pages & routes
├── components/              # Reusable UI components
├── drizzle/                 # Drizzle schema, migrations, and DB config
├── lib/                     # Utilities (AWS, validation, helpers)
├── node_modules/
├── public/                  # Static assets
├── .env.example             # Environment variable template
├── .env.local               # Local environment variables
├── components.json          # Shadcn components config (if used)
├── docker-compose.yml       # Local dev environment (Postgres, etc.)
├── Dockerfile               # Production container build
├── drizzle.config.ts        # Drizzle ORM configuration
├── eslint.config.mts        # ESLint configuration
├── next-env.d.ts
├── next.config.ts           # Next.js configuration
├── package.json
├── pnpm-lock.yaml           # Dependency lockfile
├── postcss.config.js
├── README.md                # Project documentation
├── sst-env.d.ts
├── sst.config.ts            # SST infrastructure definitions
├── tailwind.config.ts       # TailwindCSS config
├── tsconfig.json
└── tsconfig.tsbuildinfo

```

---

## 🚀 Getting Started

### Install dependencies

```bash
pnpm install
```

### Run Docker containers

```bash
docker-compose up -d
```

### Push Drizzle migrations

```bash
pnpm drizzle:push
```
