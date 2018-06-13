FROM node:9-alpine as builder
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install packages first.
COPY package.json .
COPY yarn.lock .
RUN npm install -g yarn
RUN yarn

COPY postcss.config.js .
COPY webpack.config.js .
COPY src src
RUN npm run build

# Second stage of build.
FROM nginx:1-alpine
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY nginx.conf /etc/nginx/nginx.conf
COPY index.html /usr/src/app
COPY --from=builder /usr/src/app/dist dist

EXPOSE 80

# nginx automatically starts running. No need for CMD.
