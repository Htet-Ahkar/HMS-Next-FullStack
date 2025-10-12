# Multi-stage Dockerfile for Next.js (App Router) production
# Uses an explicit node version and builds the app in a builder stage,
# then copies the production output into a slim runtime image.

ARG NODE_VERSION=24.1.0

# --------------------- Builder ---------------------
FROM node:${NODE_VERSION}-alpine AS builder
WORKDIR /usr/src/app

# Install dependencies (cache node_modules between builds)
COPY package.json package-lock.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

# --------------------- Runner ---------------------
FROM node:${NODE_VERSION}-alpine AS runner
ENV NODE_ENV=production
WORKDIR /usr/src/app

# Install only production dependencies
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy built Next.js output from builder
COPY --from=builder /usr/src/app/.next ./.next
COPY --from=builder /usr/src/app/public ./public

# Run as non-root
USER node

EXPOSE 3000

# Use start script that runs `next start` which serves the optimized build
CMD ["npm", "start"]
