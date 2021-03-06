FROM node:17-slim 

RUN apt-get update \
 && apt-get install sox libsox-fmt-mp3

WORKDIR /spotify-radio/

COPY package.json package-lock.json

RUN npm ci --silent

COPY . .

USER node 

CMD npm run dev