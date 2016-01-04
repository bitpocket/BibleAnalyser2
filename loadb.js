'use strict';

var _ = require('underscore'),
  fs = require('fs'),
  path = require('path'),
  appDir = path.dirname(require.main.filename),
  io = require('./io'),
  processData = require('./processData'),
  //jquery = fs.readFileSync("./jquery.js", "utf-8"),
  jsdom = require("jsdom");

var chapterIndex = -1,
  verseIndex = -1,
  bookIndex = -1,
  book = undefined;

function GetUrl(bookIndex, chapterIndex, verseIndex) {
  return 'http://biblia.oblubienica.eu/interlinearny/index/book/' + bookIndex + '/chapter/' + chapterIndex + '/verse/' + verseIndex;
}

function SaveVerse(book, chapterIndex, verse) {
  book.chapters[chapterIndex - 1] = book.chapters[chapterIndex - 1] || {
    'number': chapterIndex,
    'verses': []
  };
  book.chapters[chapterIndex - 1].verses.push(verse);
}

function isVerseDataEmpty(html, $) {
  return !html || $('#book').length == 0;
}

function GetBookName($) {
  return $('#book').find(":selected").text();
}

function LoadVerse() {
  var LoadVersePromise = io.getDataFromUrl(GetUrl(bookIndex, chapterIndex, verseIndex));
  LoadVersePromise.then(function(html) {

    jsdom.env(html, // [jquery],
      //"https://iojs.org/dist/",
      ["http://code.jquery.com/jquery.min.js"],
      function(err, window) {
        //console.log(window.$('#book').find(":selected").text());

        if (isVerseDataEmpty(html, window.$)) {
          if (verseIndex > 1) {
            verseIndex = 1;
            chapterIndex++;
          } else {
            Finalize();
            bookIndex++;
            if (bookIndex <= 27) {
              LoadBook(bookIndex);
            }
            return;
          }
        } else {
          var bookVerse = processData.GetBookVerse(verseIndex, window.$);
          book.name = GetBookName(window.$);
          SaveVerse(book, chapterIndex, bookVerse);
          console.log('name: ' + book.name + '; book: ' + bookIndex + '; chapter: ' + chapterIndex + '; verse: ' + verseIndex);

          verseIndex++;
        }
        LoadVerse();
        //Finalize();
      }
    );

  })
}

function SaveBook(book) {
  var fullPath = './output/' + book.number + ' - ' + book.name + '.json';
  fs.writeFile(fullPath, JSON.stringify(book), function(err) {
    if (err) {
      return console.log(err);
    }
    console.log('The file ' + fullPath + ' was saved!');
  });
}

function VersesSummary(chapters) {
  var res = '';
  for (var i = 0; i < chapters.length; i++) {
    res += (chapters[i] ? chapters[i].verses.length : '???') + ', ';
  }
  return '[' + res + ']';
  // return '[' + _.map(chapters, function(c) {
  //   return c.verses.length;
  // }) + ']';
}

function LogBookSummary(book) {
  console.log('loaded (' + book.number + ') ' +
    book.name + ' chapters: ' +
    book.chapters.length + ' ' +
    VersesSummary(book.chapters));
}

function Finalize() {
  LogBookSummary(book);
  SaveBook(book);
}

function InitializeBook() {
  book = {
    'number': bookIndex,
    'name': '',
    'chapters': []
  };
}

function LoadBook(bookId) {
  chapterIndex = 1;
  verseIndex = 1;
  bookIndex = bookId;

  InitializeBook();

  LoadVerse();
}

// process.argv.forEach(function (val, index, array) {
//   console.log(index + ': ' + val);
// });

LoadBook(process.argv[2]);
