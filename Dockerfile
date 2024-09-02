FROM node:21.7.3-alpine3.20

WORKDIR /

ENV PORT=80
ENV ORIGIN=http://localhost:80
ENV APP_DB_PATH=/data/

COPY build build
COPY migrations migrations
COPY package.json .
COPY package-lock.json .

RUN npm ci --omit dev

RUN mv package.json build/

EXPOSE 80

ENTRYPOINT ["node", "build"]
