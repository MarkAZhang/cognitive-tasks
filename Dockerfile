FROM node:9-alpine
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json .
RUN yarn install --production

# Install packages and run build-prod and build-server before running Docker build.
COPY backend-dist backend-dist
COPY frontend-dist frontend-dist
COPY challenge challenge
COPY ssl ssl

COPY gcloud-secret-key.json .
COPY server-password.js .
COPY index.html .

EXPOSE 80
EXPOSE 443

CMD npm run start-prod
