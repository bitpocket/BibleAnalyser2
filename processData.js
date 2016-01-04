'use strict';

exports.GetBookVerse = function(verseIndex, $) {
  var items = $('.item');
  var verse = {
    'number': verseIndex,
    'words': [],
    'translations': {
      'EPI': $($('.przeklad2').find('p')[0]).text(),
      'BG': $($(".przeklad3").find('p')[0]).text(),
      'UBG': $($(".przeklad4").find('p')[0]).text(),
      'BW': $($(".przeklad5").find('p')[0]).text(),
      'BT': $($(".przeklad6").find('p')[0]).text(),
      'KJVS': $($(".przeklad7").find('p')[0]).text(),
      'NKJVS': $($(".przeklad8").find('p')[0]).text()
    }
  };

  for (var i = 1; i < items.length; i++) {
    var word = {};
    word.number = $($(items[i]).find('p')[0]).text()
    word.strongIndex = $($(items[i]).find('p')[1]).text();
    word.word = $($(items[i]).find('p')[2]).text();
    word.phonetic = $($(items[i]).find('p')[3]).text();
    word.grammar = $($(items[i]).find('p')[4]).text();
    word.semantic = $($(items[i]).find('p')[5]).text();
    word.anternativeSemantic = $($(items[i]).find('p')[6]).text();

    verse.words.push(word);
  }

  return verse;
};
