FROM node:14

WORKDIR /app

COPY package.json ./

COPY yarn.lock ./

RUN yarn install --production

COPY . .

CMD [ "yarn", "start" ]
