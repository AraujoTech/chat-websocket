ARG DB_CONNECTION=Connection_Url
FROM node:latest
# Create app directory
RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY package.json  /usr/src/app/package.json
COPY package-lock.json  /usr/src/app/package-lock.json



RUN npm install

COPY . .

EXPOSE 3000

CMD [ "npm","run","start" ]













