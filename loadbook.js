var _ = require('underscore'),
  fs = require('fs'),
  path = require('path'),
  appDir = path.dirname(require.main.filename),
  request = require("request"),
  cheerio = require('cheerio');

var isFinished = false,
  chapterIndex = -1,
  verseIndex = -1,
  book = undefined;

function GetUrl(bookIndex, chapterIndex, verseIndex) {
  return 'http://biblia.oblubienica.eu/interlinearny/index/book/' + bookIndex + '/chapter/' + chapterIndex + '/verse/' + verseIndex;
}

function SaveVerse(book, chapterIndex, verse) {
  book.chapters[chapterIndex] = book.chapters[chapterIndex] || {
    'number': chapterIndex,
    'verses': []
  };
  book.chapters[chapterIndex].verses.push(verse);
}

function GetBookName() {
  return $('#book').find(":selected").text();
}

function LoadBookVerseData(bookIndex, chapterIndex, verseIndex, book, processData, finalizeBook) {

  request({
    uri: GetUrl(bookIndex, chapterIndex, verseIndex),
  }, function(error, response, body) {
    if (error) {
      console.log(error);
    }
    processData(bookIndex, chapterIndex, verseIndex, book, finalizeBook, body);
  });

}

function isVerseDataEmpty(bookData) {
  return !bookData || $('#book').length == 0;
}

function processData(bookIndex, chapterIndex, verseIndex, book, finalizeBook, bookVerseData) {
  if (isVerseDataEmpty(bookVerseData)) {
    if (verseIndex > 1) {
      verseIndex = 1;
      chapterIndex++;
    } else {
      isFinished = true;
    }
  } else {

    var bookVerse = GetBookVerseData(bookVerseData);
    book.name = GetBookName(bookVerseData);
    SaveVerse(book, chapterIndex, bookVerse);
    verseIndex++;
  }
}

function LoadBook(bookIndex) {
  isFinished = false;
  chapterIndex = 1;
  verseIndex = 1;

  book = {
    'number': bookIndex,
    'name': '',
    'chapters': []
  };

  LoadBookVerseData();
}

function SaveBook(book) {
  var fullPath = appDir + '/' + book.name + 'json';
  fs.writeFile(fullPath, book, function(err) {
    if (err) {
      return console.log(err);
    }
    console.log('The file ' + fullPath + ' was saved!');
  });
}

function VersesSummary(chapters) {
  return '[' + _.map(book.chapters, function(c) {
    return c.length;
  }) + ']';
}

function LogBookSummary(book) {
  console.log('loaded (' + book.number + ') ' +
    book.name + ' chapters: ' +
    book.chapters.lenght + ' ' +
    VersesSummary(book.chapters));
}

var book = LoadBook(11);
LogBookSummary(book);
SaveBook(book);
