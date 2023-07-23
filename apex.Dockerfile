FROM node:alpine as build

WORKDIR /showoff

COPY ./apex/package.json ./apex/
COPY ./package.json ./
COPY ./package-lock.json ./

RUN yarn install

COPY ./apex/ ./apex/

RUN cd apex && npx prisma generate
RUN yarn apex build

#stage
FROM node:alpine

ENV NODE_ENV=production

WORKDIR /showoff/

COPY ./apex/package.json ./apex/
COPY ./package.json ./
COPY ./package-lock.json ./
COPY ./apex/.env ./apex/.env 

RUN yarn install --production
RUN cd apex && npx prisma generate

COPY --from=build /showoff/apex/dist/ ./apex/dist/

CMD ["yarn", "apex", "start"]
