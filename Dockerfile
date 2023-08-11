# Use an official Node.js runtime as the base image
FROM node:lts AS base

# Set the working directory in the container
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --production


# Use the base image as the build environment
FROM base AS build

# Install build dependencies
RUN npm install

# Copy the source code into the container
COPY . .

# Build the TypeScript app
RUN npm run build 

# -------

# Use a minimal image for the final production container
FROM node:lts-slim

# Set the working directory in the container
WORKDIR /app

# Copy the built app from the build environment
COPY --from=build /app/dist ./dist
COPY package*.json ./
COPY .env ./

# Expose the port your app is running on
EXPOSE 3000

# Set environment variables if needed
# ENV NODE_ENV production

# Start your application
CMD ["node", "./dist/index.js"]