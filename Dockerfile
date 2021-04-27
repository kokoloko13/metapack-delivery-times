FROM node:14

WORKDIR /home/node/app

COPY package*.json ./

RUN npm install

CMD ["npm", "start"]