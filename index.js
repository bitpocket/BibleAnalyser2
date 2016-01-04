var sX = require('scrapper-x');
var request = require('request');

var translatesConfig = {
  repeatItemGroup: '.przeklad7',
  dataFormat: {
    text: {
      selector: 'p',
      type: 'text'
    }
  }
};

// 'translations': {
//   'EPI': $(".przeklad2")[0].children[1].innerText,
//   'BG': $(".przeklad3")[0].children[1].innerText,
//   'UBG': $(".przeklad4")[0].children[1].innerText,
//   'BW': $(".przeklad5")[0].children[1].innerText,
//   'BT': $(".przeklad6")[0].children[1].innerText,
//   'KJVS': $(".przeklad7")[0].children[1].innerText,
//   'NKJVS': $(".przeklad8")[0].children[1].innerText
// }

var versesConfig = {
  repeatItemGroup: '.item',
  dataFormat: {
    number: {
      selector: 'p:nth-of-type(1)',
      type: 'text'
    },
    strongIndex: {
      selector: 'p:nth-of-type(2)',
      type: 'text'
    },
    word: {
      selector: 'p:nth-of-type(3)',
      type: 'text'
    },
    phonetic: {
      selector: 'p:nth-of-type(4)',
      type: 'text'
    },
    grammar: {
      selector: 'p:nth-of-type(5)',
      type: 'text'
    },
    semantic: {
      selector: 'p:nth-of-type(6)',
      type: 'text'
    },
    anternativeSemantic: {
      selector: 'p:nth-of-type(7)',
      type: 'text'
    }
  }
};

function ScrapPage(url) {
  request({
    uri: url
  }, function(error, response, body) {
    var varses = {};

    if (!error && response.statusCode == 200) {
      varses = sX.scrape(body, versesConfig);
      translates = sX.scrape(body, translatesConfig);
    }

    if (error) {
      console.log(error)
    }

    console.log(varses);
    console.log(translates);
  })
}

function LoadBook(book, chapterIndex, verseIndex) {
  //  http://biblia.oblubienica.eu/interlinearny/index/book/11/chapter/1/verse/1
  var url = 'http://biblia.oblubienica.eu/interlinearny/index/book/' + book + '/chapter/' + chapterIndex + '/verse/' + verseIndex;
  ScrapPage(url);
}

LoadBook(11, 1, 1);
