FROM node:24.8-alpine3.22

WORKDIR /home/grizzl
COPY . .
ENV NPM_CONFIG_LOGLEVEL warn
RUN npm ci
RUN npm run build

ENV HOST=0.0.0.0
ENV PORT=3000

CMD ["node", ".output/server/index.mjs"]
