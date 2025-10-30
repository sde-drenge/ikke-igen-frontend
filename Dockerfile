FROM node:20-alpine AS builder
ENV NODE_ENV=production
WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install

COPY . .
ARG BACKEND_PORT
RUN yarn build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["node", "server.js"]
