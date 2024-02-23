FROM node:18.17-alpine
WORKDIR /client-portal/
RUN chown -R node:node /client-portal
COPY --chown=node:node . /client-portal
USER node
ENTRYPOINT [ "sh", "./docker-entrypoint.sh" ]
CMD [ "yarn", "start" ]