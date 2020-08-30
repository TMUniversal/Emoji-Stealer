FROM node:14

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

RUN rm -rf node_modules

RUN npm install --production

CMD [ "npm", "start" ]