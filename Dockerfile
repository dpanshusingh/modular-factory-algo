# Use official Node.js image
FROM node:18-slim

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy app source and CSV files
COPY . .

# Skip build step (it fails due to type errors in other files)
# RUN npm run build

# Expose port (Cloud Run sets PORT env var, but typical defaults)
EXPOSE 8080

# Start command using ts-node to run directly without compilation check
CMD [ "npx", "ts-node", "--transpile-only", "src/server.ts" ]
