# syntax=docker/dockerfile:1
FROM node:lts
RUN apt-get -qy update && apt-get -qy install openssl bcrypt
WORKDIR /server
COPY . .
RUN yarn install
CMD ["yarn", "dev"]
EXPOSE 8080