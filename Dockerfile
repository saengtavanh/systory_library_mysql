# Use the official Node.js image as the base image
FROM node:18

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the project dependencies
RUN npm install

# Copy the rest of the project files to the working directory
COPY . .

# Expose the port your app runs on (adjust if necessary)
EXPOSE 3001
EXPOSE 5173

# Start the development server
CMD ["npm", "run", "dev"]
