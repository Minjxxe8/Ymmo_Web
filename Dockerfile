FROM node:24-alpine

WORKDIR /home/node/app

COPY package.json .

RUN npm install

COPY . .

RUN chown -R node:node .

EXPOSE 5173

USER node

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]