# Use a Node.js base image
FROM node:latest

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Build the application
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Set the environment variable for VITE_base_url
ENV VITE_base_url=http://localhost:5000

# Command to run the application
CMD [ "npm", "run", "dev" ]

# FROM node:18-alpine3.17 as build
# WORKDIR /app
# COPY . /app
# RUN npm install
# RUN npm run build

# FROM ubuntu
# RUN apt-get update
# RUN apt-get install nginx -y
# COPY --from=build /app/dist /var/www/html/

# VITE_BACKEND_BASE_API_URL = http://127.0.0.1:5000

# EXPOSE 80
# CMD ["nginx","-g","daemon off;"]
