FROM node:14-alpine AS build
WORKDIR /usr/src/app
COPY package.json ./
COPY . .
RUN npm install
RUN npm run build

FROM nginx:1.21.6-alpine as release
COPY --from=build /usr/src/app/build /usr/share/nginx/html
COPY --from=build /usr/src/app/.env /usr/share/nginx/html/.env
COPY /nginx.conf.template /etc/nginx/templates/default.conf.template
RUN apk add --update nodejs
RUN apk add --update npm

RUN npm i -g runtime-env-cra@0.2.4
RUN echo -e '\n\
#!/bin/sh\n\
runtime-env-cra\n' >> /docker-entrypoint.d/runtime-env-cra.sh
RUN chmod 775 /docker-entrypoint.d/runtime-env-cra.sh

WORKDIR /usr/share/nginx/html
EXPOSE 80