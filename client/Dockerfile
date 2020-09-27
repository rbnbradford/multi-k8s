FROM node:alpine as dev
WORKDIR /app
COPY ./package.json .
COPY ./yarn.lock .
COPY ./tsconfig.json .
RUN yarn
COPY ./src ./src
COPY ./public ./public
CMD ["yarn", "start"]

FROM dev as build
RUN yarn build

FROM nginx
EXPOSE 3000
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html
