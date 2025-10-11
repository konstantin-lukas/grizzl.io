FROM keymetrics/pm2:24-alpine

WORKDIR /home/grizzl
COPY . .
ENV NPM_CONFIG_LOGLEVEL warn
RUN npm ci
RUN npm run build

CMD ["pm2-runtime", "start", "pm2.js"]
