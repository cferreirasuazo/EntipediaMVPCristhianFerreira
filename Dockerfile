FROM node:20-alpine AS builder
RUN apk add --no-cache libc6-compat
# Install required dependencies for pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

FROM node:20-alpine AS runner
RUN apk add --no-cache tini
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup -S next && adduser -S next -G next
USER next
COPY --chown=next:next --from=builder /app/.next/standalone ./
COPY --chown=next:next --from=builder /app/.next/static ./.next/static
COPY --chown=next:next --from=builder /app/public ./public
EXPOSE 3000
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "server.js"]
