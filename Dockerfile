FROM node:boron-wheezy
MAINTAINER Matej Fistrovič "matej.fistrovic@gmail.com"

# Create app directory
RUN mkdir -p /usr/src/app/src /usr/src/app/log

# create app user and group
RUN groupadd -r app && useradd -r -g app app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install --production

# Copy app source and change permissions
COPY . /usr/src/app
RUN chown -R app:app /usr/src/app/log

# expose port
EXPOSE 4000
CMD [ "node", "server.js" ]