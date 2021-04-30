FROM node

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8003

EXPOSE 27017

CMD ["npm", "run", "dev"]