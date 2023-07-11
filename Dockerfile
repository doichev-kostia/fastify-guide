FROM node:18-alpine as builder
WORKDIR /build
COPY package.json ./
COPY pnpm-lock.yaml ./
COPY ./install-pnpm.sh ./
RUN chmod +x ./install-pnpm.sh && ./install-pnpm.sh
RUN pnpm install

FROM node:18-alpine
RUN apk update && apk add --no-cache dump-init
ENV HOME=/home/app
ENV APP_HOME=$HOME/node/
ENV NODE_ENV=production
WORKDIR $APP_HOME
COPY --chown=node:node . $APP_HOME
COPY --chown=node:node --from=builder /build $APP_HOME
USER node
EXPOSE 3000
ENTRYPOINT ["dump-init"]
CMD ["pnpm", "start"]
