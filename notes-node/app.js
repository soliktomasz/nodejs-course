console.log('Starting app.js');

const fs = require('fs');
const _ = require('lodash')
const notes = require('./notes.js');
const yargs = require('yargs');

const argv = yargs.argv;
var command = argv._[0];
console.log('Command: ', command);


if (command === 'add') {
   var note = notes.addNote(argv.title, argv.body);
   if(note) {
       console.log(`Note ${argv.title} added succesfully!`);
   } else {
    console.log(`Note with title ${argv.title} already exist!`);
   }
} else if (command === 'list') {
    notes.getAll();
} else if (command === 'read') {
    notes.getNote(argv.title);
} else if (command === 'remove') {
    notes.removeNote(argv.title);
} else {
    console.log('Command not recognized');
}