FROM node:22.23.1-alpine

WORKDIR /app
COPY server.mjs /app/server.mjs

USER node
EXPOSE 8787
CMD ["node", "/app/server.mjs"]
