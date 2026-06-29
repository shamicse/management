FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .

ENV NODE_ENV=development
EXPOSE 5000

CMD ["npm", "run", "start"]

