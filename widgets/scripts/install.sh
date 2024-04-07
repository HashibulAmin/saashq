#!/bin/sh

echo 'Clone saashq-widgets repository and install its dependencies:'
git clone https://github.com/saashq/saashq-widgets.git
cd saashq-widgets
git checkout develop
yarn install

echo 'Create `.env.sample` from default settings file and configure it on your own:'
cp .env.sample .env

CURRENT_FOLDER=${PWD##*/}
if [ $CURRENT_FOLDER = 'saashq-widgets' ]; then
  cd ..
fi
