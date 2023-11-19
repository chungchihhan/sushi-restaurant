# Build stage
FROM --platform=linux/amd64 node:18-alpine as builder

ARG REACT_APP_API_URL

COPY frontend/ /app/frontend/
COPY lib/ /app/lib/
WORKDIR /app/frontend
RUN yarn
RUN yarn build

# Run stage
FROM --platform=linux/amd64 node:18-alpine
WORKDIR /app
COPY --from=builder /app/frontend/build ./build
RUN yarn global add serve
CMD serve -s build
