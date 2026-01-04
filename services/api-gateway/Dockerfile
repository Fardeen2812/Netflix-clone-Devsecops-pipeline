FROM node:20-alpine

WORKDIR /app

# Copy all files first (including potential local node_modules)
COPY . .

# Clean up any existing modules and install fresh
RUN rm -f package-lock.json && rm -rf node_modules
RUN npm install
RUN ls -la node_modules

# Ensure permissions
RUN chown -R node:node /app

USER node

EXPOSE 8080

CMD ["node", "server.js"]
