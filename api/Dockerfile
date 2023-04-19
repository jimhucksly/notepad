FROM node:14.18-alpine3.13

WORKDIR .

COPY . .

RUN npm install
RUN npm i ts-node -g
RUN npm i typescript@4.8.4 -g

EXPOSE 4000

CMD ["ts-node", "server.ts"]
