# syntax=docker/dockerfile:1
FROM node:lts
RUN apt-get -qy update && apt-get -qy install openssl bcrypt
WORKDIR /client
COPY . .
RUN yarn install
CMD ["yarn", "dev"]
EXPOSE 3000