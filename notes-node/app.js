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
   var message = note ? `Note ${argv.title} added succesfully!` : `Note with title ${argv.title} already exist!`;
   console.log(message);
} else if (command === 'list') {
    notes.getAll();
} else if (command === 'read') {
    notes.getNote(argv.title);
} else if (command === 'remove') {
    var noteRemoved = notes.removeNote(argv.title);
    var message = noteRemoved ? 'Note was removed' : 'Note not found';
    console.log(message);
} else {
    console.log('Command not recognized');
}