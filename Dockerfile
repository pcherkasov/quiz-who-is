# Build stage
FROM node:lts-alpine AS build
ARG REACT_APP_BASE_URL

# Устанавливаем REACT_APP_BACKEND_URL как переменную окружения
ENV REACT_APP_BASE_URL=${REACT_APP_BASE_URL}
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
