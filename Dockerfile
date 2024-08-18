FROM node:21.7.3-alpine3.20

WORKDIR /

ENV PORT=5173
ENV ORIGIN=http://localhost:5173

COPY build build
COPY package.json .
COPY package-lock.json .

RUN npm ci --omit dev

RUN mv package.json build/

ENTRYPOINT ["node", "build"]
