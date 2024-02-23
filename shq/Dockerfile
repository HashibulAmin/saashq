FROM node:12.19-alpine
WORKDIR /shq/
RUN chown -R node:node /shq
COPY --chown=node:node . /shq
USER node
ENTRYPOINT [ "sh", "./docker-entrypoint.sh" ]
CMD [ "yarn", "start" ]