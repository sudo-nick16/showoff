FROM node:20-alpine3.17 as build

WORKDIR /showoff/apex

COPY . .
COPY ./.env ./

RUN yarn install

CMD ["yarn", "start"]
