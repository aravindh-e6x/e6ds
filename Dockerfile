# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source files
COPY . .

# Build Storybook static files
RUN npm run build-storybook

# Production stage - serve with nginx
FROM nginx:alpine

# Copy built storybook from builder stage
COPY --from=builder /app/storybook-static /usr/share/nginx/html

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
