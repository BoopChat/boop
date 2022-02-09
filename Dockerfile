FROM node:14.18.1-alpine

RUN mkdir -p /home/boop
WORKDIR /home/boop

COPY client/package.json client/
COPY server/package.json server/

RUN cd server && npm install --production
RUN cd client && npm install --production

ENV NODE_ENV=production
ENV PORT=5000

COPY server/ server/
COPY client/ client/
RUN cd client && npm run build

EXPOSE 5000
CMD ["node", "server/bin/www"]