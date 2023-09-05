FROM node:18-alpine as builder
RUN apk update && apk add bash
WORKDIR /build
COPY package.json ./
COPY pnpm-lock.yaml ./
COPY tsconfig.json ./
COPY src ./src
COPY .swcrc ./
COPY types ./types
COPY ./install-pnpm.sh ./
RUN chmod +x ./install-pnpm.sh && ./install-pnpm.sh
RUN pnpm install
RUN pnpm run build:clean
RUN pnpm prune

FROM node:18-alpine
RUN apk update && apk add --no-cache dumb-init
ENV HOME=/home/app
ENV APP_HOME=$HOME/node/
ENV NODE_ENV=production
WORKDIR $APP_HOME
COPY --chown=node:node fly.toml $APP_HOME
COPY --chown=node:node --from=builder /build/package.json /build/pnpm-lock.yaml $APP_HOME
COPY --chown=node:node --from=builder /build/build $APP_HOME/build
USER node
EXPOSE 8080
ENTRYPOINT ["dumb-init"]
CMD ["./node_modules/.bin/fastify", "start", "-l", "info", "-a", "0.0.0.0", "--options", "./build/app.js"]
