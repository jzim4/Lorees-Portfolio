// ./node_modules/.bin/browserify ./js/contentful.js -o bundle.js

//TODO: from getEntries(), organize and export

const contentful = require('contentful')
const script = require('./script.js')

const client = contentful.createClient({
  space: 'lthd2e0mgc79',
  environment: 'master', // defaults to 'master' if not set
  accessToken: 'RS2CtbxsRt34wepE8El7CHFuTzj-BNXbWg3WcxrssRc'
});

art=[];
aboutTheArtist=[];
exhibitionStatement=[];
exhibitionDisplay=[];
updateDate = "";

client.getEntries({
  limit: 1000
}).then(function (entries) {
  console.log(entries);
  entries.items.forEach(function (entry) {
    if (entry.sys.contentType.sys.id == "art") {
      art.push(entry.fields);
    }
    else if (entry.sys.contentType.sys.id == "aboutTheArtist") {
      aboutTheArtist.push(entry.fields);
    }
    else if (entry.sys.contentType.sys.id == "exhibitionStatement") {
      exhibitionStatement.push(entry.fields);
    }
    else if (entry.sys.contentType.sys.id == "exhibitionDisplay") {
      exhibitionDisplay.push(entry.fields);
    }
  });
  script(art, aboutTheArtist, exhibitionStatement, exhibitionDisplay);
});