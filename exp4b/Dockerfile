# Use Node.js LTS as the base image
FROM node:22-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package files first for better Docker layer caching
COPY package*.json ./

# Install production dependencies
RUN npm ci --omit=dev

# Copy the application source code
COPY . .

# Document the port used by the Express server
EXPOSE 3001

# Start the application
CMD ["npm", "start"]