FROM node:22-alpine AS builder
WORKDIR /app

COPY package*.json ./
COPY prisma/ ./prisma/
COPY prisma.config.ts ./
COPY tsconfig.json ./
COPY src/ ./src/

RUN npm ci
ENV DATABASE_URL="postgresql://postgres:postgres@db:5432/shelter_seek?schema=public"
RUN npx prisma generate
RUN npm run build

FROM node:22-alpine
RUN apk add --no-cache curl
WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./
COPY --from=builder /app/prisma.config.ts ./

COPY entrypoint.sh ./
RUN chmod +x entrypoint.sh

ENV DATABASE_URL="postgresql://postgres:postgres@db:5432/shelter_seek?schema=public"
ENV NODE_ENV=production
EXPOSE 3000

CMD ["sh", "entrypoint.sh"]
