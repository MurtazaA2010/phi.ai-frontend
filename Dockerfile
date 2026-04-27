# Build stage - Build the Vite app
FROM node:20-alpine as builder

WORKDIR /app

# Copy package files
COPY package.json bun.lockb* package-lock.json* yarn.lock* ./

# Install dependencies
RUN npm install || npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage - Serve with a lightweight web server
FROM node:20-alpine

WORKDIR /app

# Install serve to run the production build
RUN npm install -g serve

# Copy built app from builder
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 8080

# Default command to serve the app
# The dist folder contains the built frontend
CMD ["serve", "-s", "dist", "-l", "8080"]
