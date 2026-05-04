FROM node:22-alpine AS builder

WORKDIR /app

RUN npm config set registry https://registry.npmmirror.com

COPY api/package*.json ./
RUN npm install

COPY api/ .
RUN npm run build

FROM node:22-alpine

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY api/package*.json ./

EXPOSE 3000

CMD ["node", "dist/main"]