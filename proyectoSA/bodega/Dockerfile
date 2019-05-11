FROM node:8.0
COPY /server/package*.json ./
COPY /server/bodega.js ./
COPY /server/bodega.json ./
RUN npm install
EXPOSE 80
CMD [ "node", "bodega.js" ]