FROM node:20-bookworm-slim AS base
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm ci

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN mkdir -p data && npm run db:generate && npm run db:migrate && npm run db:seed
RUN npm run build

FROM node:20-bookworm-slim AS runner
RUN apt-get update && apt-get install -y libsqlite3-0 && rm -rf /var/lib/apt/lists/*
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/data/redblacktop.db /app/data/redblacktop.db
USER nextjs
EXPOSE 3000
ENV PORT=3000 HOSTNAME=0.0.0.0 NODE_ENV=production
CMD ["node", "server.js"]
