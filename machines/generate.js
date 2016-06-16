module.exports = {

  friendlyName: 'Document preview',

  description: 'Generate a png from an office document or from a pdf file.',

  extendedDescription: 'Generate a png from an office document or from a pdf file. Also, it detect if it doesn\'t belong to this kind of file.',

  inputs: {

    from: {
      friendlyName: 'Initial file',
      example: '/pdf/document.pdf',
      description: 'The file you want to convert.',
      required: true
    },

    to: {
      friendlyName: 'Preview',
      example: '/previews/preview.png',
      description: 'The directory where you want to put your preview.',
      required: true
    },

    mime: {
      friendlyName: ' Content-type',
      example: '/previews/',
      description: 'The content type of your initial file.',
      required: true
    }

  },

  defaultExit: 'success',

  exits: {

    error: {
      description: 'Unexpected error occurred.',
      variableName: 'err'
    },

    success: {
      description: 'A preview has been generated.'
    },

    noConvertion: {
      descriptin: 'The initial file is not supported.'
    }

  },

  fn: function (inputs, exits) {
    const exec = require('child_process').exec;
    const isOffice = require('is-office');
    const crypto = require('crypto');
    const fs = require('fs');

    if (isOffice(inputs.mime)) {

       var hash = crypto.createHash('sha512');
       hash.update(Math.random().toString());
       hash = hash.digest('hex');

       var tempPDF = '/tmp/'+ hash + '.pdf';

       exec('unoconv -e PageRange=1 -o ' + tempPDF + ' \"' + inputs.from + '\"', (err) => {
         if (err) return exits.error();

         exec('convert ' + tempPDF + '[0] \"' + inputs.to + '\"', (err) => {
           if (err) return exits.error();
           fs.unlink(tempPDF, (err) => {
             if (err) return exits.error();
             return exits.success();
           });
         });
       });

    } else if (/pdf/.test(inputs.mime)) {

      exec('convert \"' + inputs.from + '\"[0] \"' + inputs.to + '\"', (err) => {
        if (err) return exits.error();
        return exits.success();
      });

    } else {
      return exits.noConvertion();
    }

  }
};
