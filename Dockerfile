# ------------------------
# Base image
# ------------------------
FROM node:20-alpine AS dev

# Install required dependencies for pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Set working directory
WORKDIR /app

# Copy only package files first (better caching)
COPY package.json pnpm-lock.yaml ./

# Install deps
RUN pnpm install

# Copy the rest of the project
COPY . .

# Next.js dev server runs on port 3000
EXPOSE 3000

# Enable hot reload + bind to 0.0.0.0 for docker
CMD ["pnpm", "dev"]
