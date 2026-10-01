FROM node:22-alpine AS client-build
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install --no-audit --no-fund
COPY client/ ./
RUN npm run build

FROM node:22-alpine AS production
WORKDIR /app
COPY server/package*.json ./server/
RUN npm install --prefix server --omit=dev --no-audit --no-fund
COPY server/ ./server/
COPY --from=client-build /app/client/dist ./client/dist
ENV NODE_ENV=production
EXPOSE 5000
CMD ["node", "server/src/server.js"]
