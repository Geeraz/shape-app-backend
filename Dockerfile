FROM node:18-alpine
WORKDIR /app

COPY package*.json ./
RUN npm install 

COPY . .
# RUN npx drizzle-kit generate && npx drizzle-kit migrate

EXPOSE 3000

