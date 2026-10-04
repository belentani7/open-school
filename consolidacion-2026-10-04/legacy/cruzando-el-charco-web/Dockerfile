# Cruzando el Charco - Multi-stage Dockerfile
# Optimized for Next.js 16 with standalone output

# === Build Stage ===
FROM node:20-alpine AS builder

# Install system dependencies
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    libc6-compat \
    git \
    openssl

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --prefer-offline --no-audit --no-fund

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build application
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# === Runtime Stage ===
FROM node:20-alpine AS runner

# Create non-root user
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

# Set working directory
WORKDIR /app

# Copy built application
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy Prisma
COPY --from=builder /app/prisma ./prisma

# Create uploads directory if needed
RUN mkdir -p /app/uploads && chown nextjs:nodejs /app/uploads

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Environment variables
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME="0.0.0.0"

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

# Run server
CMD ["node", "server.js"]