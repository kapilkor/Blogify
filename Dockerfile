# Use Node.js LTS version as base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Configure npm and install dependencies with retry logic
RUN npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000 && \
    npm config set fetch-retries 5 && \
    npm config set registry https://registry.npmjs.org/ && \
    npm install --omit=dev

# Copy application code
COPY . .

# Create uploads directory if it doesn't exist
RUN mkdir -p public/uploads

# Expose the application port
EXPOSE 3000

# Set environment to production
ENV NODE_ENV=production

# Start the application
CMD ["npm", "start"]
