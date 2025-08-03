# File: ./Docker/node/Dockerfile

FROM node:18-alpine
WORKDIR /app

# 1. Copy only the package.json files first.
# This takes advantage of Docker's layer caching.
# The 'npm install' step will only re-run if these files change.
COPY package*.json ./

# 2. Install dependencies
RUN npm install

# 3. Copy the rest of your application source code and config files
# Be specific to keep the image small and builds fast.
COPY ./src ./src
COPY ./drizzle ./drizzle
COPY tsconfig.json .
COPY drizzle.config.ts .
# Add any other root-level files your app needs here

# This is where you would build your TypeScript code
# RUN npm run build

EXPOSE 3000

# This should be the command to run your compiled JavaScript, not TypeScript
# For example: CMD [ "node", "dist/server.js" ]
# For development with ts-node, you might use:
CMD [ "npm", "run", "dev" ] # (Assuming you have a "dev" script in package.json)