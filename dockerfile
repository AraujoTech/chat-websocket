FROM node:latest
# Create app directory
RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app
ENV DB_CONNECTION = mongodb+srv://rafaelaraujo:R1R2R34f@ezops.izv1n.mongodb.net/SimpleChat?retryWrites=true&w=majority

COPY package.json  /usr/src/app/package.json
COPY package-lock.json  /usr/src/app/package-lock.json



RUN npm install

COPY . .

EXPOSE 3000

CMD [ "npm","run","start" ]













