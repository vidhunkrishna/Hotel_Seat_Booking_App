FROM node:22

WORKDIR /src

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 9090

CMD [ "npm","start" ]