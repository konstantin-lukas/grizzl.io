FROM node:24.8-alpine3.22 AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /home/grizzl

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* .npmrc* ./
RUN \
  if [ -f package-lock.json ]; then npm ci; \
  elif [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

FROM base AS builder

ARG NUXT_PUBLIC_APP_ENV
ARG NUXT_PUBLIC_VERSION
ARG NUXT_PUBLIC_ORIGIN
ARG NUXT_PUBLIC_LEGAL_EMAIL
ARG NUXT_PUBLIC_LEGAL_PHONE
ARG NUXT_PUBLIC_LEGAL_RESPONSIBLE_ENTITY
ARG NUXT_PUBLIC_LEGAL_STREET
ARG NUXT_PUBLIC_LEGAL_ZIP_AND_CITY

ENV \
  NUXT_PUBLIC_APP_ENV=$NUXT_PUBLIC_APP_ENV \
  NUXT_PUBLIC_VERSION=$NUXT_PUBLIC_VERSION \
  NUXT_PUBLIC_ORIGIN=$NUXT_PUBLIC_ORIGIN \
  NUXT_PUBLIC_LEGAL_EMAIL=$NUXT_PUBLIC_LEGAL_EMAIL \
  NUXT_PUBLIC_LEGAL_PHONE=$NUXT_PUBLIC_LEGAL_PHONE \
  NUXT_PUBLIC_LEGAL_RESPONSIBLE_ENTITY=$NUXT_PUBLIC_LEGAL_RESPONSIBLE_ENTITY \
  NUXT_PUBLIC_LEGAL_STREET=$NUXT_PUBLIC_LEGAL_STREET \
  NUXT_PUBLIC_LEGAL_ZIP_AND_CITY=$NUXT_PUBLIC_LEGAL_ZIP_AND_CITY

WORKDIR /home/grizzl
COPY . .
COPY --from=deps /home/grizzl/node_modules ./node_modules
RUN \
  if [ -f yarn.lock ]; then yarn run build; \
  elif [ -f package-lock.json ]; then npm run build; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run build; \
  else echo "Lockfile not found." && exit 1; \
  fi

FROM base AS runner
WORKDIR /home/grizzl

COPY --from=builder /home/grizzl/.output ./.output

ENV HOST=0.0.0.0
ENV PORT=3000

CMD ["node", ".output/server/index.mjs"]
