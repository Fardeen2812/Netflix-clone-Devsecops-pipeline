FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

COPY package*.json ./

RUN rm -f package-lock.json
RUN npm install
RUN ls -la node_modules

COPY . .

COPY . .

RUN chown -R node:node /app

USER node

EXPOSE 8081

CMD ["node", "server.js"]