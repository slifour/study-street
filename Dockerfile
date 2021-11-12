FROM node:14

WORKDIR /usr/src/app/client
COPY client/package*.json ./
RUN npm install
COPY client .

WORKDIR /usr/src/app/server
COPY server/package*.json ./
RUN npm install
COPY server .

EXPOSE 3000
CMD ["npm", "run", "dev"]

