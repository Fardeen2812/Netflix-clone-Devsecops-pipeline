# Base Image
# Base Image
FROM --platform=linux/amd64 node:20
# Set working directory
WORKDIR /app
RUN echo "Force Rebuild Debian" > /rebuild_marker
# Copy package files and install dependencies
COPY package*.json ./
# install dependencies
COPY package*.json ./

RUN rm -f package-lock.json && rm -rf node_modules
RUN npm install
RUN ls -la node_modules
# Copy application code
COPY . .
# Use non-root user
COPY . .

RUN chown -R node:node /app

USER node
# Expose application port
EXPOSE 8080
# Start the application
CMD ["node", "server.js"]
