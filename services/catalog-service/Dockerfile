FROM node:20-alpine

WORKDIR /app

# Upgrade npm in a clean environment first
RUN npm install -g npm@latest

# Copy all files (node_modules is excluded via .dockerignore)
COPY . .

# Install fresh dependencies
RUN npm install
RUN ls -la node_modules
RUN npm list express || echo "Express missing!"
RUN cat package.json

# Ensure permissions
RUN chown -R node:node /app

USER node

EXPOSE 8081

CMD ["node", "server.js"]