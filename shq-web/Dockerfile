FROM node:18-alpine AS base
WORKDIR /shq/
RUN chown -R node:node /shq
COPY --chown=node:node . /shq
USER node
RUN yarn build
ENTRYPOINT [ "sh", "./docker-entrypoint.sh" ]
CMD [ "yarn", "start" ]
