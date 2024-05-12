const contentful = require('contentful')
const snippets = require('./snippets.js')

function script(art, aboutTheArtist, exhibitionStatement) {

  var insertProperty = function (oldString, propName, propValue) {
    var propToReplace = "{{" + propName + "}}";
    var string = oldString.replace(new RegExp(propToReplace, "g"), propValue);
    return string;
  }

  standAlone=[];
  exhibition2023=[];

  var sortArt = function() {
    for (i in art) {
      if (art[i].collection=="Stand-alone") {
        standAlone.push(art[i]);
      }
      else if (art[i].collection=="Final Exhibition March 2023") {
        exhibition2023.push(art[i]);
      }
    }
  }

  var makeBio = function() {
    text = "<p>" + aboutTheArtist[0].bio + "</p>";
    prepareToBody = insertProperty(text, "br", "<p/><p>");
    document.querySelector('#bioText').innerHTML = prepareToBody;
  }

  var makeGallery = function() {
    html = snippets[0];
    htmlToDisplay = "";
    for (i in standAlone) {
      imgUrl = standAlone[i].images[0].fields.file.url;
      title = standAlone[i].title;
      prepareToBody = insertProperty(html, "imgUrl", imgUrl);
      prepareToBody1 = insertProperty(prepareToBody, "title", title);
      htmlToDisplay += prepareToBody1;
    }
    document.querySelector('#galleryArtContainer').innerHTML = htmlToDisplay;
  }

  var exhibition2023Statement = function() {
    text = "<p>" + exhibitionStatement[0].statement + "</p>";
    prepareToBody = insertProperty(text, "br", "<p/><p>");
    return prepareToBody;
  }

  var make2023Exhibition = function() {
    document.querySelector('#exhibition2023Statement').innerHTML = exhibition2023Statement();

    html = snippets[0];
    htmlToDisplay = "";
    for (i in exhibition2023) {
      imgUrl = exhibition2023[i].images[0].fields.file.url;
      title = exhibition2023[i].title;
      prepareToBody = insertProperty(html, "imgUrl", imgUrl);
      prepareToBody1 = insertProperty(prepareToBody, "title", title);
      htmlToDisplay += prepareToBody1;
    }
    document.querySelector('#exhibition2023ArtContainer').innerHTML = htmlToDisplay;
  }

  makeBio();
  sortArt();
  makeGallery();
  make2023Exhibition();
}

module.exports = script;