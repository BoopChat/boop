FROM node:14.18.1-alpine as buildStage

RUN mkdir -p /home/react
WORKDIR /home/react

COPY client/package.json client/package-lock.json ./
RUN npm ci --production

COPY client/ ./
RUN npm run build


FROM node:14.18.1-alpine

RUN mkdir -p /home/boop
WORKDIR /home/boop

COPY server/package.json server/package-lock.json server/
RUN cd server && npm ci --production

ENV NODE_ENV=production
ENV PORT=5000

COPY server/ server/
COPY --from=buildStage /home/react/build client/build

EXPOSE 5000
CMD ["node", "server/bin/www"]