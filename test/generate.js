var chai = require('chai');
var join = require('path').join;
chai.use(require('chai-fs'));

describe('DocumentPreview Generator', function () {
  var generate = require('../').generate;

  it('should convert a word document to a png file', function (done) {
    generate({
      from: join(__dirname, '/files/document.docx'),
      to: join(__dirname, '/files/document.png'),
      mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    }).exec({

      error: function (err) {
        done(err);
      },

      noConvertion: function () {
        done('This file should be converted');
      },

      success: function () {
        chai.expect(join(__dirname, '/files/document.png')).to.be.a.file('should have created a preview');
        done();
      }

    });

  });

  it('should not convert a jpeg', function (done) {
    generate({
      from: join(__dirname, '/files/image.jpg'),
      to: join(__dirname, '/files/image.png'),
      mime: 'image/jpeg'
    }).exec({

      error: function (err) {
        done(err);
      },

      noConvertion: function () {
        done();
      },

      success: function () {
        done('This file should not be converted');
      }

    });

  });

});
