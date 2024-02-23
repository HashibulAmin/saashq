FROM node:18.17.1-bookworm-slim
WORKDIR /saashq-widgets/
RUN chown -R node:node /saashq-widgets
RUN apt-get update -y \
    && apt-get install -y curl tzdata \
    && rm -rf /var/lib/apt/lists/*
COPY --chown=node:node . /saashq-widgets
USER node
EXPOSE 3200
ENTRYPOINT [ "node", "--max_old_space_size=8192", "dist" ]
