FROM node:18.17.1-bullseye-slim

WORKDIR /saashq
RUN chown -R node:node /saashq
COPY --chown=node:node . .

RUN apt-get update -y \
    && apt-get install -y curl ca-certificates \
    && rm -rf /var/lib/apt/lists/* \
    && yarn global add @apollo/rover@0.22.0 \
    && yarn cache clean \
    && rover supergraph compose --config /saashq/packages/gateway/src/apollo-router/dummy/supergraph.yaml --elv2-license=accept 

USER node

# pre-download apollo router
RUN mkdir -p /saashq/packages/gateway/src/apollo-router/temp \
    && cd /saashq/packages/gateway/src/apollo-router/temp \
    && (export VERSION=v1.35.0; curl -sSL https://router.apollo.dev/download/nix/v1.35.0 | sh)

ENTRYPOINT ["node", "--max-http-header-size=16384", "packages/gateway/src"]
