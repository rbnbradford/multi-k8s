FROM node:lts-alpine as dev
WORKDIR /app
COPY ./package.json .
COPY ./yarn.lock .
COPY ./tsconfig.json .
RUN yarn
COPY ./src ./src
CMD ["yarn", "dev"]

FROM dev as build
RUN yarn build

FROM node:lts-alpine
WORKDIR app
COPY --from=build /app/build ./build
COPY --from=build /app/node_modules ./node_modules
ENV NODE_ENV production
CMD npx ./build/index.js
