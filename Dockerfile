FROM node:18 AS build

COPY . .

RUN npm install && npm run build

FROM nginx

COPY --from=build dist/ /usr/share/nginx/html

EXPOSE 80