# Abschlussprojekt AWS 23-02
# Erstellung des Container-Images für das Frontend
# © 2024 Markus Rennings

FROM node:alpine as build

RUN apk add git && \
    git clone https://github.com/Abschlussprojekt2302/TS-Alumni Frontend && \
    cd Frontend && \
    npm ci && \
    npm run build

FROM nginx:alpine

COPY --from=build /Frontend/dist /usr/share/nginx/html
COPY files/default.conf /etc/nginx/conf.d

EXPOSE 80