# syntax=docker/dockerfile:1.4

FROM node:lts-buster-slim as builder

RUN apt-get update && apt-get install -y yarn

# Create app directory
WORKDIR /usr/src/app

# Copy dependency definitions
COPY package.json /usr/src/app
COPY yarn.lock /usr/src/app

# Install dependecies
RUN yarn config set strict-ssl false -g
RUN yarn config set enableStrictSsl false  -g
RUN yarn install  --frozen-lockfile
RUN mkdir node_modules/.cache && chmod -R 777 node_modules/.cache

# Get all the code needed to run the app
COPY . /usr/src/app
RUN yarn build

# ---

FROM node:lts-buster-slim

WORKDIR /usr/src/app

COPY --from=builder --chown=node:node /usr/src/app/package*.json ./
COPY --from=builder --chown=node:node /usr/src/app/node_modules/ ./node_modules/
COPY --from=builder --chown=node:node /usr/src/app/dist/ ./dist/
COPY --from=builder --chown=node:node /usr/src/app/views/ ./views/
COPY --from=builder --chown=node:node /usr/src/app/public/ ./public/

EXPOSE 3000

CMD ["yarn", "start:prod"]
