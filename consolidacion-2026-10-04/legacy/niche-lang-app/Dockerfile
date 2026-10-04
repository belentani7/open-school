FROM node:22-alpine AS builder

WORKDIR /app
RUN npm install -g pnpm@9.12.0

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

FROM node:22-alpine AS runner
WORKDIR /app
RUN npm install -g pnpm@9.12.0

ENV NODE_ENV=production
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/drizzle ./drizzle

EXPOSE 3000
CMD ["node", "dist/index.js"]
