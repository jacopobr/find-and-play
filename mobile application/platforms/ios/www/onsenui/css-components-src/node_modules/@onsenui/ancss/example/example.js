var ancss = require('../index');

ancss.parseFile(__dirname + '/example.css', function(error, docs) {
  if (error) {
    throw error;
  }

  docs.forEach(function(doc) {
    console.log('name: ' + doc.annotation.name);
    console.log('markup: ' + doc.annotation.markup);
    console.log('css: \n' + doc.css);
  });
});
