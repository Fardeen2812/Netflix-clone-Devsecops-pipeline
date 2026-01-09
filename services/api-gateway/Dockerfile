FROM node:22-alpine

WORKDIR /app

# Copy all files (node_modules is excluded via .dockerignore)
COPY . .

# Install fresh dependencies
RUN npm install
RUN ls -la node_modules

# Ensure permissions
RUN chown -R node:node /app

USER node

EXPOSE 8080

CMD ["node", "server.js"]
