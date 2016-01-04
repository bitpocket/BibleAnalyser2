'use strict';

var request = require("request");

exports.getDataFromUrl = function(url) {
  return new Promise(function(resolve, reject) {
    request(url, function(error, response, data) {
      error = error || response.statusCode !== 200;
      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    });
  });
};
