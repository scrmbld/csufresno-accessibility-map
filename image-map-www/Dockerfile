FROM node:20.11.1-alpine3.18
WORKDIR ./app
COPY . .
RUN npm install
RUN "mkdir" "-p" "public/leaflet"
COPY node_modules/leaflet/dist/ ./public/leaflet/
RUN "mkdir" "-p" "public/purify"
COPY node_modules/dompurify/dist/purify.min.js ./public/purify/purify.js
CMD ["node", "app.js"]
EXPOSE 3300
