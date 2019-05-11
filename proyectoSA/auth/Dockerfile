FROM node:8.0
COPY /server/package*.json ./
COPY /server/auth.js ./
COPY /server/servers.json ./
COPY /server/entrada.json ./
RUN npm install
EXPOSE 80
CMD [ "node", "auth.js" ]