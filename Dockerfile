FROM node:12.16.3-buster-slim AS builder
USER node
RUN mkdir /home/node/app
WORKDIR /home/node/app
COPY --chown=node:node package-lock.json package.json ./
RUN npm install
COPY --chown=node:node . .
RUN npm run build


FROM nginx:alpine
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=builder /home/node/app/build .
ENTRYPOINT ["nginx", "-g", "daemon off;"]