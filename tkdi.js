#!/usr/bin/env node

/*
 * This script was written to compare keys in locale files for updates and inconsistencies. It
 * was written in the context of the OpenHistoricalMap (OHM) fork of overpass-turbo and will be
 * modified to work in other OHM properties.
 */
'use strict';

const
  { Command, Argument, Option } = require('commander'),
  program = new Command,
  fs = require('fs'),
  orderedJson = require('json-order').default
;

program
  .name('tkdi')
  .description('CLI to compare values and existence of locale key/object pairs')
  .version('0.1.0', '-v, --version')
  .usage('[options] <outfile>')
  .argument('[outfile]', 'defaults to out.json', 'out.json')
  .requiredOption('-o, --ours <baseFile>', 'base file')
  .requiredOption('-t, --theirs <newFile>', 'new file')
  .option('-n, --dry-run', "show questionable keys but do not write an output file")
  .option('-d, --debug', "display all keys, one ours/theirs pair per line")
  .action((outfile) => {
    const options = program.opts();

    fs.readFile(options.ours, (err, data) => {
      if (err) throw err;
      const
        keysObjsOurs = orderedJson.parse(data).object
      ;

      fs.readFile(options.theirs, (err, data) => {
        if (err) throw err;
        const
          keysObjsTheirs = orderedJson.parse(data).object
        ;

        // if theirs has a value, use theirs to replace ours
        if (options.debug) console.info('Ours vs. Theirs');
        for (const key in keysObjsOurs) {
          if (Object.prototype.hasOwnProperty.call(keysObjsTheirs, key)) {
            if (options.debug) console.info(`  Ours: ${keysObjsOurs[key]}\tTheirs: ${keysObjsTheirs[key]}`)
            keysObjsOurs[key] = keysObjsTheirs[key];
          }
        }
        // if theirs has a key we don't have, flag it for evaluation
        let headerShown = false;
        for (const key in keysObjsTheirs) {
          if (!Object.prototype.hasOwnProperty.call(keysObjsOurs, key)) {
            if (!headerShown) {
              console.warn('Theirs vs. Ours ("What fresh hell can this be?" –Dorothy Parker)');
              headerShown = true;
            }
            console.warn(`  Theirs has key not in Ours: ${key} value: ${orderedJson.stringify(keysObjsTheirs[key])}`)
            keysObjsOurs[key] = keysObjsTheirs[key];
          }
        }
        if (!options.dryRun) {
          fs.writeFile(outfile, orderedJson.stringify(keysObjsOurs, '', '\n',7), err => {
            if (err) throw err
          });
        } else {
          console.info('Option --dry-run given so no file has been written')
        }
      })
    });
  })

program.parse();
