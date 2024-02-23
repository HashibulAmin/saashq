FROM node:18.17.1-alpine AS base
WORKDIR /saashqpos/
RUN chown -R node:node /saashqpos
COPY --chown=node:node . /saashqpos
USER node
RUN yarn build
ENTRYPOINT [ "sh", "./docker-entrypoint.sh" ]
CMD [ "yarn", "start" ]
