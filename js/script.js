const contentful = require('contentful')
const snippets = require('./snippets.js')

function script(art, aboutTheArtist, exhibitionStatement, exhibitionDisplay) {

  var insertProperty = function (oldString, propName, propValue) {
    var propToReplace = "{{" + propName + "}}";
    var string = oldString.replace(new RegExp(propToReplace, "g"), propValue);
    return string;
  }

  var removeSpaces = function(stringBefore) {
    return stringBefore.replace(/ /g, "");
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
    bioUrl = aboutTheArtist[0].portrait.fields.file.url;
    document.querySelector('#bioImg').style.backgroundImage = "url(\"" + bioUrl + "\")";

    text = "<p class=\"indent\">" + aboutTheArtist[0].bio + "</p>";
    prepareToBody = insertProperty(text, "br", "<p/><p class=\"indent\">");
    document.querySelector('#bioText').innerHTML = prepareToBody;
  }

  var makeGallery = function() {
    html = snippets[0];
    htmlToDisplay = "";
    for (i in standAlone) {
      imgUrl = standAlone[i].images[0].fields.file.url;
      title = standAlone[i].title;
      id = removeSpaces(standAlone[i].title);
      prepareToBody = insertProperty(html, "imgUrl", imgUrl);
      prepareToBody1 = insertProperty(prepareToBody, "title", title);
      prepareToBody2 = insertProperty(prepareToBody1, "id", id);
      htmlToDisplay += prepareToBody2;
    }
    document.querySelector('#galleryArtContainer').innerHTML = htmlToDisplay;
  }

  var exhibition2023Statement = function() {
    text = "<p class=\"indent\">" + exhibitionStatement[0].statement + "</p>";
    prepareToBody = insertProperty(text, "br", "<p/><p class=\"indent\">");
    return prepareToBody;
  }

  var make2023Exhibition = function() {

    exhibitionDisplayArt = "";
    for (i in exhibitionDisplay[0].images) {
      exhibitionDisplayArt += "<img class=\"exhibitionImage px-3 py-3\" src=\"" + exhibitionDisplay[0].images[i].fields.file.url + "\">";
    }
    exhibitionDisplayArt += "";
    console.log(exhibitionDisplay);
    console.log(exhibitionDisplayArt);

    document.querySelector('#exhibition2023Display').innerHTML = exhibitionDisplayArt;

    document.querySelector('#exhibition2023Statement').innerHTML = exhibition2023Statement();

    html = snippets[0];
    htmlToDisplay = "";
    for (i in exhibition2023) {
      imgUrl = exhibition2023[i].images[0].fields.file.url;
      title = exhibition2023[i].title;
      id = removeSpaces(exhibition2023[i].title);
      prepareToBody = insertProperty(html, "imgUrl", imgUrl);
      prepareToBody1 = insertProperty(prepareToBody, "title", title);
      prepareToBody2 = insertProperty(prepareToBody1, "id", id);
      htmlToDisplay += prepareToBody2;
    }
    document.querySelector('#exhibition2023ArtContainer').innerHTML = htmlToDisplay;
  }


  var setIdContent = function() {
    var modal = document.getElementById('artIdPage')

    modal.addEventListener('show.bs.modal', event => {
      const id = event.relatedTarget.getAttribute('data-bs-chooseContent');

      var artToDisplay;
      for (i in art) {
        if (removeSpaces(art[i].title)==id) {
          artToDisplay = art[i];
        }
      }
      modal.querySelector('.modal-title').textContent = artToDisplay.title;
      
      artistStatement = insertProperty(artToDisplay.artistStatement, "br", "</p><p class=\"indent\">");
      artistStatement1 = insertProperty(artistStatement, "break", "<br>");

      prepareToBody = "<div class=\"my-2 mx-auto\" id=\"idStatement\"><p class=\"indent\">" + artistStatement1 + "</p></div>";
      prepareToBody +="<div class=\"row\" id=\"idPageArt\">";
      for (j in artToDisplay.images) {
        prepareToBody += "<img class=\"idImage px-2 py-2\" src=\"" + artToDisplay.images[j].fields.file.url + "\"></img>";
      }
      prepareToBody += "</div>";
      
      modal.querySelector(".modal-body").innerHTML = prepareToBody;
      console.log(prepareToBody);
    });
  }

  makeBio();
  sortArt();
  makeGallery();
  make2023Exhibition();
  setIdContent();
}

module.exports = script;