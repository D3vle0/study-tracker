FROM node:12-alpine
WORKDIR /study-tracker
COPY package*.json ./
RUN npm install --silent
COPY . .
CMD [ "npm", "start" ]
EXPOSE 4001
