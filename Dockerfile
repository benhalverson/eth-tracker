# Use an official Node.js runtime as the base image
FROM node:lts-slim

# Set the working directory in the container
WORKDIR /app

# Copy the application source code and package files
COPY . .

# Install production dependencies
RUN npm i -g typescript
RUN npm install

# Build the TypeScript app
RUN npm run build

# Expose the port your app is running on
EXPOSE 3000

# Set environment variables if needed
# ENV NODE_ENV production

# Start your application
CMD ["node", "./dist/index.js"]