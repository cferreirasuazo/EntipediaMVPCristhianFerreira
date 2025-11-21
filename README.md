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
├── app/                     # Next.js App Router pages & routes
├── components/              # Reusable UI components
├── drizzle/                 # Drizzle schema, migrations, config
├── lib/                     # Utility modules (AWS, validation, helpers)
├── public/                  # Static assets
├── .env.example             # Environment variable template
├── .env.local               # Local environment variables
├── docker-compose.yml       # Local development services
├── Dockerfile               # Production container build
├── Dockerfile.dev           # Development container
├── drizzle.config.ts
├── eslint.config.mts
├── next.config.ts
├── package.json
├── pnpm-lock.yaml
├── postcss.config.js
├── tailwind.config.ts
├── tsconfig.json
└── tsconfig.tsbuildinfo


```

---

# 🚀 Getting Started

## ⚙️ Environment Variables

### **`.env.local` Example**

Create a `.env.local` file with:

```
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
S3_BUCKET=your_bucket_name

# Postgres (Docker)
DATABASE_URL=postgres://postgres:postgres@db:5432/entipedia_db
```

# 🐳 Docker

Build docker containers using compose for development

```bash
docker-compose build
```

Run container

```bash
docker-compose up -d
```

Run migrations

```bash
docker compose run --rm web pnpm drizzle-kit push
```
