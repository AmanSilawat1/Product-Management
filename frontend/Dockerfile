# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Set build-time variables if needed
# ARG VITE_API_URL
# ENV VITE_API_URL=$VITE_API_URL

RUN npm run build