# Build stage
FROM node:lts-alpine AS build

WORKDIR /app

# Only copy the package.json and package-lock.json initially
COPY package*.json ./

RUN npm ci --only=production

# Then copy everything else
COPY . .

RUN npm run build

# Runtime stage
FROM node:lts-alpine AS base

WORKDIR /app

COPY --from=build /app/build ./build
RUN npm install -g serve

EXPOSE 3000
CMD ["serve", "-s", "build"]
