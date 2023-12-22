# Build stage
FROM --platform=linux/amd64 node:18-alpine as builder
COPY backend/ /app/backend/
COPY lib/ /app/lib/
WORKDIR /app/backend
RUN yarn
RUN yarn build

# Run stage
FROM --platform=linux/amd64 node:18-alpine
WORKDIR /app
COPY --from=builder /app/backend/dist ./dist
COPY backend/package.json backend/yarn.lock ./
RUN yarn install --production && yarn cache clean
CMD yarn start
