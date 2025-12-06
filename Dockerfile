FROM node:24-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY .env .env
COPY tsconfig.json ./
COPY nest-cli.json ./
COPY prisma ./prisma/
COPY prisma.config.ts ./

RUN npx prisma generate
COPY ./src ./src
RUN npm run build

FROM node:24-alpine
WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY prisma ./prisma/
COPY prisma.config.ts ./

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/generated ./src/generated


EXPOSE 4000
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/src/main"]
