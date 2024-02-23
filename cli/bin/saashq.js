#!/usr/bin/env node
'use strict';

const _ = require('lodash');

const program = require('commander');
const packageJSON = require('../package.json');
const startCmd = require('../commands/start');
const updateCmd = require('../commands/update');
const {
  removeService,
  syncui,
  installerUpdateConfigs,
  up,
  update,
  restart,
  deployDbs,
  dumpDb,
  deployMongoBi
} = require('../commands/docker/utils');

const { devOnly, devCmd, devStop } = require('../commands/dev');

/**
 * Normalize version argument
 *
 * `$ saashq -v`
 * `$ saashq -V`
 * `$ saashq --version`
 * `$ saashq version`
 */

program.allowUnknownOption(true);

// Expose version.
program.version(packageJSON.version, '-v, --version');

// Make `-v` option case-insensitive.
process.argv = _.map(process.argv, arg => {
  return arg === '-V' ? '-v' : arg;
});

// `$ saashq version` (--version synonym)
program
  .command('version')
  .description('output your version of SaasHQ')
  .action(() => {
    console.log(packageJSON.version);
  });

program
  .command('dev')
  .description('Run saashq in dev mode using pm2')
  .option('--bash', 'Add interpreter:/bin/bash')
  .option('--deps', 'Install ui dependencies')
  .option('--ignoreRun', 'Ignore pm2 start')
  .option('--ignoreCoreUI', 'Do not stop uis')
  .option('--ignoreCore', 'Do not stop coreapi')
  .option('-i, --interval <ms>', 'Time interval between starting individual services. Unit is in milliseconds. Default value is 0')
  .action(devCmd);

program
  .command('dev-only')
  .description('Run only given service')
  .action(devOnly);

program
  .command('dev-stop')
  .description('Stop pm2 services')
  .action(devStop);

program
  .command('start')
  .option('--ignoreDownload', 'Ignore latest updates download')
  .description('Run saashq')
  .action(startCmd);

program
  .command('deploy-dbs')
  .description('Delpoy dbs using docker')
  .action(deployDbs);

program
  .command('dump-db')
  .description('Dump database')
  .option('--copydump', 'Copy dump folder')
  .action(dumpDb);

program
  .command('up')
  .description('Run saashq using docker')
  .option('--uis', 'Download uis')
  .option('--locales', 'Redownload the locales')
  .option('--fromInstaller', 'From installer')
  .action(up);

program
  .command('update')
  .option('--noimage', 'Skip image pull')
  .option('--uis', 'Update uis')
  .action(update);

program
  .command('restart')
  .action(restart);

program
  .command('remove-service')
  .action(removeService);

program
  .command('syncui')
  .action(syncui);

program
  .command('installer-update-configs')
  .action(installerUpdateConfigs);

program
  .command('deploy-mongobi')
  .action(deployMongoBi);

// `$ update saashq`
program
  .command('upgrade')
  .description('Download the latest changes of saashq')
  .action(updateCmd);

program.parse(process.argv);