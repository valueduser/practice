FROM node:lts-slim as runtime
WORKDIR /app

RUN mkdir -p /app && chown -R node:node /app
USER node

COPY package.json .
RUN rm -rf node_modules package-lock.json

RUN npm install

COPY . .

RUN npm run build

ENV HOST=0.0.0.0
ENV PORT=3000
EXPOSE 3000

CMD node ./dist/server/entry.mjs