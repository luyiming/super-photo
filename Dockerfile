FROM node:10

# Set the working directory to /app
WORKDIR /src

# Copy the current directory contents into the container at /app
ADD . /src

RUN npm install

# Define environment variable
ENV PORT 80

# Make port 80 available to the world outside this container
EXPOSE 80

# Run app.py when the container launches
CMD ["npm", "start"]
