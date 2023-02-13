FROM node:14.18-alpine3.13

WORKDIR .

COPY . .

RUN npm install

EXPOSE 4000

CMD ["node", "server.js"]