FROM node:22-alpine

WORKDIR /app

# Copy all files (node_modules is excluded via .dockerignore)
COPY . .

# Remove potential incompatible lockfile and install fresh dependencies
RUN rm package-lock.json
RUN npm install
RUN ls -la node_modules
RUN npm list express || echo "Express missing!"
RUN cat package.json

# Ensure permissions
RUN chown -R node:node /app

USER node

EXPOSE 8081

CMD ["node", "server.js"]