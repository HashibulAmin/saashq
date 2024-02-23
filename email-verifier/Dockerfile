FROM node:18.17.1-alpine
WORKDIR /saashq-email-verifier
RUN chown -R node:node /saashq-email-verifier \
 && apk add --no-cache tzdata
COPY --chown=node:node . /saashq-email-verifier
USER node
EXPOSE 4100
ENTRYPOINT ["node", "--max_old_space_size=8192", "dist"]
